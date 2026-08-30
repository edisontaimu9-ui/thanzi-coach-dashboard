import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Base must match the repo name for a GitHub Pages *project* site
// (https://<user>.github.io/thanzi-coach-dashboard/).
// If you ever move this to a custom domain or a user/org page, change base to "/".
export default defineConfig({
  base: "/thanzi-coach-dashboard/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "Thanzi Coach — Vitals",
        short_name: "Thanzi Vitals",
        description: "Monitoring dashboard for the Thanzi Coach WhatsApp bot",
        theme_color: "#0A1310",
        background_color: "#0A1310",
        display: "standalone",
        orientation: "portrait",
        start_url: "/thanzi-coach-dashboard/",
        scope: "/thanzi-coach-dashboard/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Don't try to precache/serve the live stats API from the cache —
        // this dashboard should always hit the network for fresh numbers.
        navigateFallbackDenylist: [/^\/stats/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://thanzi-coach-whatsapp.edisontaimu9.workers.dev",
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
});
