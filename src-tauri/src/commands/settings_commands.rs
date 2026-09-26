//src-tauri/src/commands/settings_commands.rs
use crate::error::VaultError;
use crate::state::AppState;
use crate::vault;
use crate::vault::model::VaultConfig;
use tauri::State;

#[tauri::command]
pub fn get_settings(state: State<'_, AppState>) -> Result<serde_json::Value, VaultError> {
    // 1. Lock the active session to safely read from memory
    let session_guard = state.session.lock().unwrap();

    // 2. If a vault is currently unlocked, extract its specific settings
    if let Some(session) = session_guard.as_ref() {
        let settings_json = serde_json::to_value(&session.data.settings)
            .map_err(|_| VaultError::NotAnEvorisFile)?;
        Ok(settings_json)
    } else {
        // Fallback (Should only happen if frontend requests settings while vault is locked)
        Ok(serde_json::json!({}))
    }
}

#[tauri::command]
pub fn update_settings(
    settings: serde_json::Value,
    state: State<'_, AppState>,
) -> Result<(), VaultError> {
    // 1. Parse the incoming JSON from frontend into our strict Rust struct
    let new_settings: VaultConfig =
        serde_json::from_value(settings).map_err(|_| VaultError::NotAnEvorisFile)?;

    // 2. Lock session (RAM) and active_path (Disk Path) safely
    let mut session_guard = state.session.lock().unwrap();
    let path_guard = state.active_path.lock().unwrap();

    // 3. If everything is successfully unlocked, overwrite and encrypt!
    if let (Some(session), Some(path)) = (session_guard.as_mut(), path_guard.as_ref()) {
        // Update the RAM state
        session.data.settings = new_settings;

        // Atomically re-encrypt and save directly into the .evs file on disk
        vault::save_vault(path, &session.data, &session.key, &session.salt)?;
    }

    Ok(())
}
