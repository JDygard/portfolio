# jdygard.com

Personal portfolio — a statically generated React site built around an
interactive career timeline with skill-linked filtering.

## Stack

React 18 + Vite, prerendered at build time (SSG) and served as static files
from S3 behind CloudFront. No server, no CMS.

## Develop

```bash
npm install
npm start        # vite dev server
```

## Build

```bash
npm run build    # client build + SSR bundle + prerender into dist/index.html
npm run preview  # serve the built output locally
```

## Deploy

Push to `main` — GitHub Actions builds and syncs to S3, then invalidates
CloudFront (auth via OIDC, no stored keys). See [DEPLOY.md](DEPLOY.md) for the
one-time AWS setup and `deploy.sh` for ad-hoc manual deploys.

## Content

All timeline items, projects, and skill groups live in
`src/data/timeline.json` — the single source of truth. Skill chips on the
landing page open the timeline filtered to that skill.
