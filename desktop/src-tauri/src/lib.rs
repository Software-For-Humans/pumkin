use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::{Manager, RunEvent, WindowEvent};

const PORT: u16 = 3847;
const STARTUP_TIMEOUT: Duration = Duration::from_secs(30);

// Hold the child Node process so we can kill it on app exit.
struct NodeChild(Mutex<Option<Child>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Resolve where the bundled Next.js standalone server lives.
            // In dev: relative to CARGO_MANIFEST_DIR (src-tauri/), go up two
            // levels to the project root, then into web/.next/standalone/.
            // (With outputFileTracingRoot set in next.config.mjs, the standalone
            // output is flat — server.js sits at the root of standalone/.)
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
                app.path()
                    .resource_dir()?
                    .join("web")
            };

            // Per-OS app data dir for the SQLite database.
            let data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&data_dir)?;
            let db_path = data_dir.join("agentkit.db");

            eprintln!("[agentkit] starting Next.js server in {:?}", web_dir);
            eprintln!("[agentkit] db at {:?}", db_path);

            let server_js = web_dir.join("server.js");
            if !server_js.exists() {
                return Err(format!(
                    "Next.js standalone server.js not found at {:?}. Did you run `npm run build:web` first?",
                    server_js
                )
                .into());
            }

            // In dev: use the system `node` (faster iteration; assumes Node is on PATH).
            // In release: use the Node binary we bundled via externalBin, resolved alongside the app exe.
            let node_cmd = if cfg!(debug_assertions) {
                std::path::PathBuf::from("node")
            } else {
                resolve_bundled_node(app)?
            };
            eprintln!("[agentkit] node binary: {:?}", node_cmd);

            let child = Command::new(&node_cmd)
                .current_dir(&web_dir)
                .env("AGENTKIT_DB", &db_path)
                .env("PORT", PORT.to_string())
                .env("HOSTNAME", "127.0.0.1")
                .arg(&server_js)
                .stdout(Stdio::inherit())
                .stderr(Stdio::inherit())
                .spawn()
                .map_err(|e| {
                    format!(
                        "Failed to spawn `node` at {:?}: {}. {}",
                        node_cmd,
                        e,
                        if cfg!(debug_assertions) {
                            "Ensure Node.js 22.5+ is installed and on PATH."
                        } else {
                            "Bundled Node binary missing — this is a packaging bug."
                        }
                    )
                })?;

            app.manage(NodeChild(Mutex::new(Some(child))));

            // Wait for the server to start responding before showing the window,
            // so the user doesn't see a "connection refused" flash.
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                let started = Instant::now();
                let url = format!("http://127.0.0.1:{}/", PORT);
                loop {
                    if started.elapsed() > STARTUP_TIMEOUT {
                        eprintln!("[agentkit] server did not become ready within {:?}", STARTUP_TIMEOUT);
                        break;
                    }
                    match std::net::TcpStream::connect(("127.0.0.1", PORT)) {
                        Ok(_) => {
                            eprintln!("[agentkit] server ready, showing window");
                            if let Some(w) = app_handle.get_webview_window("main") {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                            break;
                        }
                        Err(_) => std::thread::sleep(Duration::from_millis(150)),
                    }
                }
                // Suppress unused warning when not formatting `url` for users.
                let _ = url;
            });

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { .. } = event {
                kill_node_child(window.app_handle());
            }
        })
        .build(tauri::generate_context!())
        .expect("error building tauri application")
        .run(|app_handle, event| {
            if let RunEvent::Exit = event {
                kill_node_child(app_handle);
            }
        });
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
