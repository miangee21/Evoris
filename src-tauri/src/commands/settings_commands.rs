//src-tauri/src/commands/settings_commands.rs
use crate::error::VaultError;

#[tauri::command]
pub fn get_settings() -> Result<serde_json::Value, VaultError> {
    // Future proof: Returns a basic JSON configuration
    Ok(serde_json::json!({
        "autoLockMinutes": 5,
        "theme": "system"
    }))
}

#[tauri::command]
pub fn update_settings(_settings: serde_json::Value) -> Result<(), VaultError> {
    // Implementation placeholder for when settings are mapped to VaultData
    Ok(())
}
