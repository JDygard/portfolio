# Server Rendering the Portfolio — Analysis & Plan

## TL;DR

Your goals are **SEO / share previews** and **faster first paint**. For a portfolio that has **zero per-request data**, those goals are met by **pre-rendering HTML at build time (SSG)** — not by running a live server (true SSR). SSG keeps your cheap static-S3 model and is a small, low-risk change.

Reserve true SSR for when you actually add per-request/per-user content (a blog from a CMS, auth, personalization). You said that *might* come; it isn't here yet.

**Recommendation: add build-time pre-rendering (SSG) now. Revisit Next.js only if/when dynamic content lands.**

---

## What you have today

| Aspect | Current state |
|---|---|
| Stack | Vite 8, React 18.2, styled-components 5.3.11 |
| Rendering | Pure client-side SPA — `ReactDOM.createRoot` in `src/index.jsx` |
| Output | `vite build` → `dist/` → static files in an S3 bucket |
| Data | None. All content is hard-coded in components. No fetch/API/CMS. |
| Routing | None. Single page. |
| Interactivity | Project modal (`PortfolioItems`), SVG draw animation (`ProfilePicture`), dropdown (`TitleBar`). Three themes are defined, but the live render hardcodes `minimalistTheme` — `App` holds no state and the `StyleSelector` switcher isn't wired into `PortfolioContent`. |
| Browser API use | `window`/`document` only ever called inside `useEffect` — **already SSR-safe** |

Two things make this an easy candidate:

1. **No server data.** Nothing needs to be computed per request, so there is nothing that *requires* a live server.
2. **No SSR landmines.** Every `window`/`document` access is inside an effect (runs client-only), so server rendering won't crash on undefined globals.

The one real piece of work in any server-render path is **styled-components**: it injects CSS at runtime, so the server must collect that CSS and inline it into the HTML, or the first paint flashes unstyled (FOUC). styled-components ships a `ServerStyleSheet` API exactly for this.

---

## The actual question: SSR vs SSG

People usually say "SSR" when they mean "send real HTML instead of an empty `<div id="root">`." There are two ways to do that:

- **SSG (Static Site Generation):** render the HTML **once at build time**, ship the resulting `.html` to S3. Identical SEO and first-paint benefit. No server. No per-request cost.
- **SSR (Server-Side Rendering):** render the HTML **on every request** from a running Node process. Only worth it when the output changes per request/user.

Since your content is identical for every visitor, **SSG produces byte-for-byte what SSR would produce**, minus the server, the cold starts, and the ops. That's why it's the right tool here.

---

## Options compared

| Option | What it is | Hosting | Effort | Best when |
|---|---|---|---|---|
| **A. SSG / pre-render (recommended)** | Add a build step that renders the app to static HTML with inlined critical CSS. Keep Vite. | **Stays on S3** + CloudFront | **Low** (~half a day) | Static content, want SEO + fast paint. *(You are here.)* |
| **B. Astro + React islands** | Migrate the shell to Astro; keep React components as interactive "islands." Ships near-zero JS for static parts. | Static → S3 | Medium | Want best-in-class perf and don't mind a framework migration |
| **C. Next.js (App Router)** | Full framework: SSG + SSR + ISR. Reuses React components but changes project shape. | Vercel, **or** AWS via OpenNext/SST (Lambda + CloudFront) | Medium–High | Real dynamic/per-request content is coming |
| **D. Custom Vite SSR + Node/Lambda@Edge** | True on-demand SSR keeping Vite; you run/host the render server. | Node host or Lambda@Edge | High (most ops) | You need per-request rendering but want to stay on Vite |

### Why not just jump to Next.js?

It's the popular answer, but for this app it's a net negative *right now*: you'd trade a 2-file Vite setup for a framework, re-do styled-components as an App-Router style registry, and either adopt Vercel or take on OpenNext/Lambda plumbing on AWS — all to render content that never changes per request. The payoff (ISR, server components, per-request data) only materializes once you have dynamic content. Keep it on the table as the *graduation* path.

---

## styled-components caveat (applies to A, C, D)

- **v5.3 is in maintenance.** It works for SSR via `ServerStyleSheet`, but consider bumping to v6 if you touch this much. Next's App Router additionally needs a `StyleSheetManager` "registry" component.
- **Theme + hydration:** `PortfolioContent` hardcodes `minimalistTheme` with no state, so server and client render identically — **no mismatch today**. If you later wire up the `StyleSelector` switcher *and* persist the choice (e.g. in `localStorage`), the server can't know it, and you'll get a hydration mismatch / flash. Fix then by storing the theme in a **cookie** (readable server-side) or gating the switch behind an effect.

---

## Recommended plan — Option A (SSG with Vite)

Goal: `npm run build` emits a `dist/index.html` that already contains the rendered markup **and** the critical CSS, hydrates on load, and still deploys to S3 unchanged.

The cleanest way is the `vite-react-ssg` plugin (handles the server entry, styled-components collection hook, and HTML emission for you). A from-scratch `react-dom/server` script is also viable if you'd rather not add a dependency — both are sketched below.

### Step 1 — Make the entry hydrate instead of mount
`src/index.jsx`: swap `createRoot(...).render(...)` for `hydrateRoot(document.getElementById('root'), <App/>)`. (With `vite-react-ssg` you instead export your app from an entry it controls.)

### Step 2 — Collect styled-components CSS on the server
Wrap the server render with `ServerStyleSheet`:
```js
import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';

const sheet = new ServerStyleSheet();
const html = renderToString(sheet.collectStyles(<App />));
const styleTags = sheet.getStyleTags(); // inline into <head>
```
Inject `html` into `<div id="root">…</div>` and `styleTags` into `<head>` of the template. This is what kills the FOUC.

### Step 3 — Add the build pipeline
- With `vite-react-ssg`: add it to `vite.config.js`, point it at the routes (just `/`), and its `build` command writes pre-rendered HTML.
- Manual route: a small `prerender.mjs` that imports the built server bundle, runs Step 2, and writes `dist/index.html`. Wire it as a `postbuild` script.

### Step 4 — Fill in the SEO/meta you actually wanted
Pre-rendering only helps SEO if the tags exist. Current `index.html` has a malformed meta line (`<meta name="JDygard Portfolio" content="…">` — the name/description are swapped) and no OpenGraph/Twitter tags. Add, in `<head>`:
- a real `<meta name="description">`
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `<link rel="canonical">`

This is where the share-preview win comes from.

### Step 5 — Verify
- `npm run build` then **view-source** on `dist/index.html`: you should see real markup and a `<style>` block, not an empty root.
- Disable JS in the browser → page still shows content and is styled.
- Run Lighthouse SEO + check first-contentful-paint before/after.
- Test the theme switcher, modal, dropdown, and face animation still work after hydration (no console hydration warnings).

### Step 6 — Deploy (unchanged)
Same `aws s3 sync dist/ …`. Make sure CloudFront/S3 sends `Content-Type: text/html` and reasonable cache headers (short for `index.html`, long+immutable for hashed `/assets`).

**Estimated effort:** ~half a day, no hosting change, fully reversible.

---

## If you want true SSR anyway (Option D sketch)

Because you asked about SSR specifically:

1. Keep Vite; add `server.mjs` (Express/Hono) using Vite's `ssrLoadModule` in dev and the built SSR bundle in prod.
2. Two entries: `entry-client.jsx` (`hydrateRoot`) and `entry-server.jsx` (`renderToString` + `ServerStyleSheet`, returns `{ html, styleTags }`).
3. Server injects both into the HTML template per request and responds.
4. **Hosting changes:** you now run a process. Options: a small Node host (Fly/Render/EC2), or **Lambda@Edge / CloudFront Functions** in front of your existing bucket so static assets still come from S3 and only the HTML is rendered at the edge.
5. Add caching (e.g. CloudFront cache the rendered HTML) — at which point you've essentially rebuilt SSG with extra steps, which is the tell that SSG was the right call for static content.

---

## Decision guide

- **Want SEO + fast paint, content stays static →** Option A (SSG). Do this.
- **Want max performance, OK with a framework migration →** Option B (Astro).
- **Adding a CMS-backed blog / auth / per-user content →** Option C (Next.js), accept the hosting move.
- **Need per-request rendering but married to Vite →** Option D.

If it were my call: ship Option A now (it directly delivers both stated goals, keeps S3, low risk), keep Next.js as the upgrade path for when real dynamic content arrives.
