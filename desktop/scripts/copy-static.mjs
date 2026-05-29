// scripts/copy-static.mjs — Next.js standalone output omits public/ and .next/static.
// Copy them into the standalone tree so the bundle is fully self-contained.
import { cp, mkdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(__dirname, "..", "..", "web");
// With outputFileTracingRoot: __dirname in next.config.mjs, the standalone
// server.js lives at .next/standalone/server.js (no intermediate subdir).
const standaloneDir = resolve(webDir, ".next", "standalone");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

await mkdir(resolve(standaloneDir, ".next"), { recursive: true });

// Copy .next/static
const staticSrc = resolve(webDir, ".next", "static");
const staticDst = resolve(standaloneDir, ".next", "static");
if (await exists(staticSrc)) {
  await cp(staticSrc, staticDst, { recursive: true });
  console.log("copied .next/static");
}

// Copy public/ if it exists
const publicSrc = resolve(webDir, "public");
const publicDst = resolve(standaloneDir, "public");
if (await exists(publicSrc)) {
  await cp(publicSrc, publicDst, { recursive: true });
  console.log("copied public/");
}

console.log("standalone bundle ready at", standaloneDir);
