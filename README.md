# Thanzi Coach Dashboard

Monitoring dashboard for the Thanzi Coach WhatsApp bot (Cloudflare Worker `/stats` endpoint).

## Structure

```
src/
  config.js                # endpoint + token, shared everywhere
  api/useStats.js          # data-fetching hook (fetch, auto-refresh, error state)
  components/
    PulseLine.jsx
    StatusBadge.jsx
    RangeSelector.jsx
    MetricCard.jsx
    BreakdownBars.jsx
  App.jsx                  # assembles the dashboard
  main.jsx                 # React entry point
```

Add new views as new components in `src/components/` and wire them into `App.jsx` (or add a router later if this grows into multiple pages).

## Local development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds and deploys automatically on every push to `main`.

One-time setup in the repo:
1. Push this project to `main`.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The next push (or a manual run from the **Actions** tab) will publish to:
   `https://edisontaimu9-ui.github.io/thanzi-coach-dashboard/`

`vite.config.js` sets `base: "/thanzi-coach-dashboard/"` to match this repo name — update it if you ever rename the repo.

## CORS note

The dashboard fetches `https://thanzi-coach-whatsapp.edisontaimu9.workers.dev/stats` directly from the browser. The Worker needs to respond with an `Access-Control-Allow-Origin` header (e.g. `*`, or specifically `https://edisontaimu9-ui.github.io`) on `/stats`, or the fetch will fail with a CORS error once this is live on Pages.

## Security note

The stats token is embedded in the client bundle (`src/config.js`) and will be visible to anyone who views this site or its source. Fine for a low-stakes personal dashboard; rotate the token or add real auth if this ever needs to be private.
