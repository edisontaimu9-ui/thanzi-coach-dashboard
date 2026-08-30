import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base must match the repo name for a GitHub Pages *project* site
// (https://<user>.github.io/thanzi-coach-dashboard/).
// If you ever move this to a custom domain or a user/org page, change base to "/".
export default defineConfig({
  plugins: [react()],
  base: "/thanzi-coach-dashboard/",
});
