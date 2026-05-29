# agentkit-desktop

Tauri 2 shell that wraps the agentkit web app into a native desktop window. Spawns the bundled Next.js standalone server as a child process, points the embedded webview at it, and stores the SQLite database in the OS app-data directory.

## One-time setup

### 1. Install Rust

Tauri builds need the Rust toolchain.

- **Windows**: install [Rustup](https://www.rust-lang.org/tools/install) and Visual Studio Build Tools with the "Desktop development with C++" workload.
- **macOS / Linux**: same Rustup link, plus standard build tools.

### 2. Install desktop deps

```bash
cd desktop
npm install
```

## Dev loop

```bash
cd desktop
npm run dev
```

Dev mode uses your system `node` for fast iteration. Steps:

1. Build the Next.js standalone bundle.
2. Compile the Rust shell once, then watch for changes.
3. Open a native window pointing at the embedded server on port 3847.

The window stays hidden until the server responds, so no blank "connection refused" flash. Closing the window kills the child Node process cleanly.

## Production build

```bash
cd desktop
npm run build
```

What `npm run build` does that `npm run dev` doesn't:

1. **`setup:node`** — downloads a portable Node binary for the current platform from nodejs.org (~30-40MB, cached in `src-tauri/binaries/`). Named with the rustc target triple so Tauri's `externalBin` picks the right one.
2. **`build:web`** — same as dev, builds the Next.js standalone bundle.
3. **`tauri build`** — compiles release mode, bundles the standalone server and the Node binary into the installer, signs (if configured), packages into platform installers.

Output: `src-tauri/target/release/bundle/`

- Windows: `.msi` and NSIS `.exe`
- macOS: `.dmg` and `.app`
- Linux: `.deb`, `.rpm`, `.AppImage`

The release binary **does not require Node.js on the target machine** — the bundled Node is used at runtime.

## Limitations

- **No code signing yet.** Windows will show "unknown publisher" warnings; macOS will refuse to open without right-click → Open. Code-signing requires an Apple Developer cert (~$99/yr) and a Windows signing cert ($300-500/yr).
- **No auto-update yet.** Tauri's updater plugin is the next add.

## Where state lives

- SQLite database (per-OS app-data dir):
  - Windows: `%APPDATA%\app.agentkit.desktop\agentkit.db`
  - macOS: `~/Library/Application Support/app.agentkit.desktop/agentkit.db`
  - Linux: `~/.local/share/app.agentkit.desktop/agentkit.db`
- Ollama: external — user installs separately. The Next.js app talks to `http://localhost:11434` by default; override with `OLLAMA_URL`.
