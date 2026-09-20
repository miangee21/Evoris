//src-tauri/src/commands/transfer_commands.rs
use crate::error::VaultError;
use crate::state::AppState;
use tauri::State;

#[tauri::command]
pub fn export_vault_json(state: State<'_, AppState>) -> Result<String, VaultError> {
    let session_guard = state.session.lock().unwrap();
    let session = session_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    // Serialize active in-memory data to JSON string for the user to download
    serde_json::to_string_pretty(&session.data).map_err(VaultError::ParseError)
}

#[tauri::command]
pub fn read_import_file(_path: String) -> Result<String, VaultError> {
    Err(VaultError::CorruptedVault(
        "Import feature not implemented yet".into(),
    ))
}

#[tauri::command]
pub fn create_vault_from_import(
    _path: String,
    _password: &str,
    _json: String,
) -> Result<(), VaultError> {
    Err(VaultError::CorruptedVault(
        "Import feature not implemented yet".into(),
    ))
}
