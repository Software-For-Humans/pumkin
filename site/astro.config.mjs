import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// Hybrid: static by default for marketing pages (they opt in with
// `export const prerender = true`), server-rendered for /api/* and /thank-you.
export default defineConfig({
  site: "https://pumkin.app",
  output: "server",
  integrations: [
    sitemap({
      // Keep non-indexable / non-marketing routes out of the sitemap.
      filter: (page) =>
        !page.includes("/thank-you") &&
        !page.includes("/api/"),
    }),
  ],
  adapter: vercel({
    webAnalytics: { enabled: false },
    maxDuration: 30,
  }),
  trailingSlash: "never",
});
