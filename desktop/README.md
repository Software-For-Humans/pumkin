# agentkit-desktop

Tauri 2 shell that wraps the agentkit web app into a native desktop window. Spawns the Next.js standalone server as a child process, points the embedded webview at it, and migrates the SQLite database to the OS-appropriate app-data directory.

## One-time setup

### 1. Install Rust

Tauri builds need the Rust toolchain.

- **Windows**: install [Rustup](https://www.rust-lang.org/tools/install). Also install Visual Studio Build Tools (C++ workload) — Tauri prompts you if missing.
- **macOS / Linux**: same Rustup link, plus standard build tools (`xcode-select --install` / `build-essential`).

### 2. Install desktop deps

```bash
cd desktop
npm install
```

This pulls `@tauri-apps/cli` only — Cargo handles the Rust deps on first build.

## Dev loop

```bash
cd desktop
npm run dev
```

What this does:

1. `npm run build:web` in `../web` (Next.js build → `.next/standalone/`).
2. Copies `.next/static` and `public/` into the standalone bundle (they aren't included by default).
3. Runs `tauri dev` which compiles the Rust shell once, opens a window, and spawns the Next.js server as a sidecar on port 3847.

The window stays hidden until the server responds, so you don't see a blank "connection refused" flash. Closing the window kills the child Node process; if anything goes wrong, also check Task Manager for orphaned `node.exe`.

## Production build

```bash
cd desktop
npm run build
```

Produces installers under `src-tauri/target/release/bundle/`:

- Windows: `.msi` and `.exe` (NSIS)
- macOS: `.dmg` and `.app`
- Linux: `.deb`, `.rpm`, `.AppImage`

## Important limitations of this v0.0.1

- **Node.js must be installed on the target machine** (22.5+). The desktop bundle ships the Next.js standalone server but spawns the user's `node`. A future iteration will bundle a portable Node binary per OS (~80MB).
- **No code signing.** Windows will show "unknown publisher" warnings; macOS will refuse to open without a right-click → Open. Code-signing requires an Apple Developer cert ($99/yr) and a Windows signing cert.
- **No auto-update yet.** Tauri has a built-in updater plugin we'll wire up later.

## Where state lives

- SQLite: per-OS app-data dir.
  - Windows: `%APPDATA%\app.agentkit.desktop\agentkit.db`
  - macOS: `~/Library/Application Support/app.agentkit.desktop/agentkit.db`
  - Linux: `~/.local/share/app.agentkit.desktop/agentkit.db`
- Ollama: external — user installs separately. The Next.js app talks to `http://localhost:11434` by default.
