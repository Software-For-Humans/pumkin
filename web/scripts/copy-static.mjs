// scripts/copy-static.mjs
// Next.js `output: "standalone"` intentionally omits .next/static and public/
// from the standalone bundle. The standalone server still expects to serve them
// from inside its own tree, so we copy them in after every build. Without this,
// the desktop app serves raw HTML with no CSS/JS (everything 404s).
//
// Runs automatically as the `postbuild` npm hook. npm sets cwd to the package
// root (web/), so these relative paths resolve correctly.
import { existsSync, cpSync } from "node:fs";

if (!existsSync(".next/static")) {
  console.error("✗ .next/static not found — run `next build` first.");
  process.exit(1);
}

cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
console.log("✓ copied .next/static → .next/standalone/.next/static");

if (existsSync("public")) {
  cpSync("public", ".next/standalone/public", { recursive: true });
  console.log("✓ copied public → .next/standalone/public");
}
