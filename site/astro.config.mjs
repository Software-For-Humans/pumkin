import { defineConfig } from "astro/config";

export default defineConfig({
  // Site URL used for absolute URLs in OG tags, sitemap, etc.
  // Replace with the real domain once it's purchased (pumkin.app, pumkin.dev, etc.)
  site: "https://pumkin.app",

  // Static output. Vercel auto-detects this and serves from /dist.
  output: "static",

  // Trailing-slash off for cleaner URLs.
  trailingSlash: "never",
});
