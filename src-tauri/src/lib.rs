#![deny(unsafe_code)]
#![warn(clippy::all, clippy::pedantic)]

pub mod crypto;
pub mod error;
pub mod vault;

/// Initializes and runs the Tauri application.
///
/// # Panics
/// Panics if the Tauri application fails to build or run due to missing OS resources or bad configuration.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
