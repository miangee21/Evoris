#![deny(unsafe_code)]
#![warn(clippy::all, clippy::pedantic)]
#[allow(
    clippy::missing_errors_doc,
    clippy::missing_panics_doc,
    clippy::needless_pass_by_value
)]
pub mod commands;
pub mod crypto;
pub mod error;
pub mod state;
pub mod vault;

/// Initializes and runs the Tauri application.
///
/// # Panics
/// Panics if the Tauri application fails to build or run due to missing OS resources or bad configuration.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(state::AppState::default())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::vault_commands::create_vault,
            commands::vault_commands::open_vault,
            commands::vault_commands::lock_vault,
            commands::vault_commands::unlock_vault,
            commands::vault_commands::close_vault,
            commands::vault_commands::get_vault_state,
            commands::vault_commands::change_master_password,
            commands::category_commands::list_categories,
            commands::category_commands::create_category,
            commands::category_commands::update_category,
            commands::category_commands::delete_category,
            commands::item_commands::list_items,
            commands::item_commands::create_item,
            commands::item_commands::update_item,
            commands::item_commands::delete_item,
            commands::trash_commands::list_trash,
            commands::trash_commands::restore_item,
            commands::trash_commands::delete_item_permanently,
            commands::trash_commands::empty_trash,
            commands::settings_commands::get_settings,
            commands::settings_commands::update_settings,
            commands::transfer_commands::export_vault_json,
            commands::transfer_commands::read_import_file,
            commands::transfer_commands::create_vault_from_import,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
