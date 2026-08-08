Lean SSG portfolio app (the "different styles" plumbing was shelved).

Build: `npm run build` = client build + SSR bundle + prerender into `dist/index.html`.
Deploy: automatic on push to `main` via GitHub Actions (OIDC -> S3 + CloudFront); see DEPLOY.md. `deploy.sh` for ad-hoc manual deploys.

Analytics: cookieless, vendor-agnostic shim in `src/analytics.js` (`track()`), off unless `VITE_ANALYTICS_PROVIDER` is set at build time. See ANALYTICS.md.

Content lives in `src/data/timeline.json` — single source of truth for timeline items, skill groups, and projects. Skill chips on the main page open the timeline filtered to that skill.

Done: animated interactive employment-history timeline (desktop horizontal + mobile vertical layouts).
Planned: technical writeup "blog".
