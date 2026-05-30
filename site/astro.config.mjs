import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

// Hybrid: static by default for marketing pages (they opt in with
// `export const prerender = true`), server-rendered for /api/* and /thank-you.
export default defineConfig({
  site: "https://pumkin.app",
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: false },
    maxDuration: 30,
  }),
  trailingSlash: "never",
});
