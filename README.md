# Thanzi Coach Dashboard

Monitoring dashboard for the Thanzi Coach WhatsApp bot (Cloudflare Worker `/stats` endpoint).

## Structure

```
src/
  config.js                # endpoint + token, shared everywhere
  api/
    useStats.js             # snapshot stats hook (fetch, auto-refresh, stale-cache fallback)
    useTimeseries.js         # per-day trend hook (same caching pattern)
    cache.js                 # localStorage read/write helper
  components/
    PulseLine.jsx
    StatusBadge.jsx           # live / syncing / stale / offline
    RangeSelector.jsx
    MetricCard.jsx
    BreakdownBars.jsx
    TrendChart.jsx            # messages + new users per day
  App.jsx                  # assembles the dashboard
  main.jsx                 # React entry point
```

Add new views as new components in `src/components/` and wire them into `App.jsx` (or add a router later if this grows into multiple pages).

## Offline / stale-data handling

Every successful fetch is cached in `localStorage`, keyed by endpoint + day-range. If a later fetch fails (offline, CORS hiccup, worker down), the dashboard falls back to the last cached result and shows an amber "stale" badge with the cache timestamp instead of a hard error. The red "offline" error screen only appears when there's no cached data at all yet (e.g. first-ever load with no connection).

## Trend chart

`GET /stats/timeseries?token=...&days=N` on the Worker returns a per-day series of `{ date, messages, new_users }`, zero-filled for every day in range. `TrendChart.jsx` renders it as a simple two-line SVG chart (messages in green, new users in amber) — no charting library needed for this data size.


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

## PWA

The dashboard is installable (Add to Home Screen on Android/iOS, or the install icon in a desktop browser). `vite-plugin-pwa` generates the manifest and service worker at build time — nothing to run manually. The service worker caches the app shell for offline/instant loading but always goes to the network for `/stats`, so you never see stale numbers. Icons live in `public/` (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`).

## CORS note

The dashboard fetches `https://thanzi-coach-whatsapp.edisontaimu9.workers.dev/stats` directly from the browser. The Worker needs to respond with an `Access-Control-Allow-Origin` header (e.g. `*`, or specifically `https://edisontaimu9-ui.github.io`) on `/stats`, or the fetch will fail with a CORS error once this is live on Pages.

## Security note

The stats token is embedded in the client bundle (`src/config.js`) and will be visible to anyone who views this site or its source. Fine for a low-stakes personal dashboard; rotate the token or add real auth if this ever needs to be private.
