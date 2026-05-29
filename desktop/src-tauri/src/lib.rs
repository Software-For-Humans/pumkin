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
            // levels to the project root, then into web/.next/standalone/web.
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
                    .join("web")
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

            let child = Command::new("node")
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
                        "Failed to spawn `node`: {}. Ensure Node.js 22.5+ is installed and on PATH.",
                        e
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
