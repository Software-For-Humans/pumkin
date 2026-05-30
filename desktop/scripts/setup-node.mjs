// scripts/setup-node.mjs — download a portable Node binary for the current platform
// and stage it under src-tauri/binaries/ for Tauri to bundle as a resource.
// Idempotent: skips download if the target file already exists.
import { mkdir, access, writeFile, rm } from "node:fs/promises";
import { createWriteStream, createReadStream } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TAURI_DIR = resolve(__dirname, "..", "src-tauri");
const BINARIES_DIR = resolve(TAURI_DIR, "binaries");

// Pin a Node version explicitly so builds are reproducible. Node 24.x has stable
// node:sqlite (no experimental warning), which is what the runtime uses.
const NODE_VERSION = "24.10.0";

// Map of platform/arch → { archive filename, binary path inside the archive,
// output filename }. Output names match Tauri's externalBin convention:
// `node-{rustc-target-triple}{ext}` so Tauri bundles only the matching one.
const TARGETS = {
  "win32-x64": {
    archive: `node-v${NODE_VERSION}-win-x64.zip`,
    binaryInArchive: `node-v${NODE_VERSION}-win-x64/node.exe`,
    output: "node-x86_64-pc-windows-msvc.exe",
  },
  "darwin-arm64": {
    archive: `node-v${NODE_VERSION}-darwin-arm64.tar.gz`,
    binaryInArchive: `node-v${NODE_VERSION}-darwin-arm64/bin/node`,
    output: "node-aarch64-apple-darwin",
  },
  "darwin-x64": {
    archive: `node-v${NODE_VERSION}-darwin-x64.tar.gz`,
    binaryInArchive: `node-v${NODE_VERSION}-darwin-x64/bin/node`,
    output: "node-x86_64-apple-darwin",
  },
  "linux-x64": {
    archive: `node-v${NODE_VERSION}-linux-x64.tar.xz`,
    binaryInArchive: `node-v${NODE_VERSION}-linux-x64/bin/node`,
    output: "node-x86_64-unknown-linux-gnu",
  },
};

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

const platformKey = `${process.platform}-${process.arch}`;
const target = TARGETS[platformKey];
if (!target) {
  console.error(`[setup-node] unsupported platform ${platformKey}`);
  console.error(`[setup-node] supported: ${Object.keys(TARGETS).join(", ")}`);
  process.exit(1);
}

await mkdir(BINARIES_DIR, { recursive: true });
const outputPath = resolve(BINARIES_DIR, target.output);

if (await exists(outputPath)) {
  console.log(`[setup-node] ${target.output} already present, skipping download`);
  process.exit(0);
}

const url = `https://nodejs.org/dist/v${NODE_VERSION}/${target.archive}`;
const tmpArchive = resolve(tmpdir(), target.archive);
console.log(`[setup-node] downloading ${url}`);

const res = await fetch(url);
if (!res.ok || !res.body) {
  console.error(`[setup-node] download failed: ${res.status}`);
  process.exit(1);
}
await pipeline(res.body, createWriteStream(tmpArchive));
console.log(`[setup-node] downloaded to ${tmpArchive}`);

// Extract the single binary we need from the archive.
console.log(`[setup-node] extracting ${target.binaryInArchive}`);
if (target.archive.endsWith(".zip")) {
  await extractFromZip(tmpArchive, target.binaryInArchive, outputPath);
} else {
  await extractFromTar(tmpArchive, target.binaryInArchive, outputPath);
}

// Make sure the extracted binary is executable on Unix.
if (process.platform !== "win32") {
  await import("node:fs/promises").then((fs) => fs.chmod(outputPath, 0o755));
}

await rm(tmpArchive, { force: true });
console.log(`[setup-node] staged ${outputPath}`);

// ---- helpers ----

async function extractFromZip(zipPath, entryName, outPath) {
  // Use PowerShell's Expand-Archive on Windows (no external tools needed),
  // then copy the single file we want out of the extracted tree.
  const extractDir = resolve(tmpdir(), `pumkin-node-extract-${Date.now()}`);
  await run("powershell", [
    "-NoProfile",
    "-Command",
    `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`,
  ]);
  const extracted = resolve(extractDir, entryName.replace(/\//g, "\\"));
  await pipeline(createReadStream(extracted), createWriteStream(outPath));
  await rm(extractDir, { recursive: true, force: true });
}

async function extractFromTar(tarPath, entryName, outPath) {
  // System tar handles both .tar.gz and .tar.xz on modern macOS and Linux.
  const extractDir = resolve(tmpdir(), `pumkin-node-extract-${Date.now()}`);
  await mkdir(extractDir, { recursive: true });
  await run("tar", ["-xf", tarPath, "-C", extractDir, entryName]);
  const extracted = resolve(extractDir, entryName);
  await pipeline(createReadStream(extracted), createWriteStream(outPath));
  await rm(extractDir, { recursive: true, force: true });
}

function run(cmd, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}
