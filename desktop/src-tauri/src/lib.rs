use std::fs::{File, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::{Mutex, OnceLock};
use std::time::{Duration, Instant};
use tauri::{Manager, RunEvent, WindowEvent};

const PORT: u16 = 3847;
const STARTUP_TIMEOUT: Duration = Duration::from_secs(30);

// Hold the child Node process so we can kill it on app exit.
struct NodeChild(Mutex<Option<Child>>);

// Global handle to the startup log file (writes from any thread go here).
static LOG_FILE: OnceLock<Mutex<File>> = OnceLock::new();

fn log_path() -> PathBuf {
    // Prefer LOCALAPPDATA on Windows; fall back to temp_dir if env var missing.
    if let Some(local) = std::env::var_os("LOCALAPPDATA") {
        let dir = PathBuf::from(local).join("agentkit");
        let _ = std::fs::create_dir_all(&dir);
        return dir.join("startup.log");
    }
    if let Some(home) = std::env::var_os("HOME") {
        let dir = PathBuf::from(home).join(".agentkit");
        let _ = std::fs::create_dir_all(&dir);
        return dir.join("startup.log");
    }
    std::env::temp_dir().join("agentkit-startup.log")
}

fn init_log() {
    let path = log_path();
    if let Ok(file) = OpenOptions::new().create(true).write(true).truncate(true).open(&path) {
        let _ = LOG_FILE.set(Mutex::new(file));
    }
}

fn log_line(s: &str) {
    eprintln!("{}", s);
    if let Some(lock) = LOG_FILE.get() {
        if let Ok(mut f) = lock.lock() {
            let _ = writeln!(f, "{}", s);
            let _ = f.flush();
        }
    }
}

// Convenience: write a formatted line to the log.
macro_rules! logf {
    ($($t:tt)*) => { log_line(&format!($($t)*)) };
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_log();
    logf!("[agentkit] === startup ===");
    logf!("[agentkit] current_exe = {:?}", std::env::current_exe().ok());
    logf!("[agentkit] cwd = {:?}", std::env::current_dir().ok());

    let build_result = tauri::Builder::default()
        .setup(|app| {
            // Resolve where the bundled Next.js standalone server lives.
            // In dev: relative to CARGO_MANIFEST_DIR (src-tauri/), go up two
            // levels to the project root, then into web/.next/standalone/.
            // In bundled release: under the app's resources directory.
            let web_dir = if cfg!(debug_assertions) {
                std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                    .parent()
                    .ok_or("CARGO_MANIFEST_DIR has no parent")?
                    .parent()
                    .ok_or("desktop/ has no parent")?
                    .join("web")
                    .join(".next")
                    .join("standalone")
            } else {
                app.path().resource_dir()?.join("web")
            };
            // Windows' `\\?\` extended-length namespace prefix breaks Node.js path
            // parsing (it splits on `\` and lstats `C:`, which fails with EISDIR).
            // Strip it here so all paths we pass into Node are normal Win32 paths.
            let web_dir = strip_unc_prefix(&web_dir);
            logf!("[agentkit] web_dir = {:?}", web_dir);
            logf!("[agentkit] web_dir exists = {}", web_dir.exists());

            // Per-OS app data dir for the SQLite database.
            let data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&data_dir)?;
            let db_path = data_dir.join("agentkit.db");
            logf!("[agentkit] db_path = {:?}", db_path);

            let server_js = web_dir.join("server.js");
            logf!("[agentkit] server_js = {:?}", server_js);
            logf!("[agentkit] server_js exists = {}", server_js.exists());
            if !server_js.exists() {
                let msg = format!(
                    "Next.js standalone server.js not found at {:?}. Did you run `npm run build:web` first?",
                    server_js
                );
                logf!("[agentkit] ERROR: {}", msg);
                return Err(msg.into());
            }

            // In dev: use system `node`. In release: bundled Node next to the exe.
            let node_cmd = if cfg!(debug_assertions) {
                std::path::PathBuf::from("node")
            } else {
                match resolve_bundled_node(app) {
                    Ok(p) => p,
                    Err(e) => {
                        logf!("[agentkit] ERROR resolving bundled node: {}", e);
                        return Err(e);
                    }
                }
            };
            logf!("[agentkit] node_cmd = {:?}", node_cmd);
            logf!("[agentkit] node_cmd exists = {}", node_cmd.exists());

            // Redirect Node stdout/stderr to log files so we can debug Node-side failures.
            let log_dir = log_path().parent().map(|p| p.to_path_buf()).unwrap_or_else(std::env::temp_dir);
            let node_stdout_path = log_dir.join("node-stdout.log");
            let node_stderr_path = log_dir.join("node-stderr.log");
            logf!("[agentkit] node stdout -> {:?}", node_stdout_path);
            logf!("[agentkit] node stderr -> {:?}", node_stderr_path);

            let node_stdout = File::create(&node_stdout_path)
                .map_err(|e| format!("create stdout log: {}", e))?;
            let node_stderr = File::create(&node_stderr_path)
                .map_err(|e| format!("create stderr log: {}", e))?;

            let child = Command::new(&node_cmd)
                .current_dir(&web_dir)
                .env("AGENTKIT_DB", &db_path)
                .env("PORT", PORT.to_string())
                .env("HOSTNAME", "127.0.0.1")
                // Suppress Node's "ExperimentalWarning: SQLite is experimental"
                // noise. node:sqlite is stable in 24.x but the legacy warning
                // still fires and clutters logs.
                .env("NODE_NO_WARNINGS", "1")
                .arg(&server_js)
                .stdout(Stdio::from(node_stdout))
                .stderr(Stdio::from(node_stderr))
                .spawn();

            let child = match child {
                Ok(c) => {
                    logf!("[agentkit] node spawned, pid = {}", c.id());
                    c
                }
                Err(e) => {
                    let msg = format!(
                        "Failed to spawn node at {:?}: {} ({:?})",
                        node_cmd, e, e.kind()
                    );
                    logf!("[agentkit] ERROR: {}", msg);
                    return Err(msg.into());
                }
            };

            app.manage(NodeChild(Mutex::new(Some(child))));

            // Poll for server readiness in a background thread.
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                let started = Instant::now();
                loop {
                    if started.elapsed() > STARTUP_TIMEOUT {
                        logf!("[agentkit] ERROR: server did not become ready within {:?}", STARTUP_TIMEOUT);
                        logf!("[agentkit] check node-stderr.log and node-stdout.log for details");
                        break;
                    }
                    match std::net::TcpStream::connect(("127.0.0.1", PORT)) {
                        Ok(_) => {
                            logf!("[agentkit] server ready in {:?}, showing window", started.elapsed());
                            if let Some(w) = app_handle.get_webview_window("main") {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                            break;
                        }
                        Err(_) => std::thread::sleep(Duration::from_millis(150)),
                    }
                }
            });

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { .. } = event {
                kill_node_child(window.app_handle());
            }
        })
        .build(tauri::generate_context!());

    match build_result {
        Ok(app) => {
            logf!("[agentkit] tauri build OK, entering run loop");
            app.run(|app_handle, event| {
                if let RunEvent::Exit = event {
                    logf!("[agentkit] RunEvent::Exit, killing node child");
                    kill_node_child(app_handle);
                }
            });
        }
        Err(e) => {
            logf!("[agentkit] FATAL: tauri build failed: {}", e);
        }
    }

    logf!("[agentkit] === exit ===");
}

fn kill_node_child(app_handle: &tauri::AppHandle) {
    if let Some(state) = app_handle.try_state::<NodeChild>() {
        if let Ok(mut guard) = state.0.lock() {
            if let Some(mut child) = guard.take() {
                let _ = child.kill();
                let _ = child.wait();
            }
        }
    }
}

// Resolve the bundled Node binary. Tauri's externalBin places it alongside
// the main app executable, renamed from `node-{target-triple}{ext}` (in the
// source tree) to just `node{ext}` (in the installed bundle).
fn resolve_bundled_node(_app: &tauri::App) -> Result<std::path::PathBuf, Box<dyn std::error::Error>> {
    let exe_dir = std::env::current_exe()?
        .parent()
        .ok_or("current_exe has no parent")?
        .to_path_buf();

    let node_name = if cfg!(target_os = "windows") { "node.exe" } else { "node" };
    let node_path = exe_dir.join(node_name);

    if !node_path.exists() {
        return Err(format!("bundled node binary not found at {:?}", node_path).into());
    }

    Ok(node_path)
}

// Strip Windows' `\\?\` extended-length namespace prefix from a path.
// Tauri's resource_dir() returns paths with this prefix on Windows, which
// breaks Node.js path parsing (it lstats `C:` and fails with EISDIR).
// On non-Windows targets this is a no-op.
#[cfg(target_os = "windows")]
fn strip_unc_prefix(p: &std::path::Path) -> std::path::PathBuf {
    let s = p.to_string_lossy();
    // Handle both `\\?\C:\foo` (drive form) and `\\?\UNC\server\share` (UNC form).
    if let Some(rest) = s.strip_prefix(r"\\?\UNC\") {
        std::path::PathBuf::from(format!(r"\\{}", rest))
    } else if let Some(rest) = s.strip_prefix(r"\\?\") {
        std::path::PathBuf::from(rest)
    } else {
        p.to_path_buf()
    }
}

#[cfg(not(target_os = "windows"))]
fn strip_unc_prefix(p: &std::path::Path) -> std::path::PathBuf {
    p.to_path_buf()
}
