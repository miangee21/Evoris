//src-tauri/src/commands/vault_commands.rs
use crate::error::VaultError;
use crate::state::{AppState, VaultSession};
use crate::vault::model::VaultData;
use serde::Serialize;
use std::path::PathBuf;
use tauri::{AppHandle, Emitter, State};

#[derive(Serialize, Clone)]
struct ProgressPayload {
    stage: String,
    percent: u8,
}

#[derive(Serialize)]
pub struct VaultStateResponse {
    pub is_unlocked: bool,
    pub vault_name: Option<String>,
    pub file_name: Option<String>,
}

#[tauri::command]
pub fn create_vault(
    state: State<'_, AppState>,
    path: String,
    password: &str,
) -> Result<VaultData, VaultError> {
    let path_buf = PathBuf::from(&path);
    let (data, key, salt) = crate::vault::create_vault(&path_buf, password)?;

    *state.session.lock().unwrap() = Some(VaultSession {
        data: data.clone(),
        key,
        salt,
    });
    *state.active_path.lock().unwrap() = Some(path_buf);
    Ok(data)
}

#[tauri::command]
pub fn open_vault(
    state: State<'_, AppState>,
    path: String,
    password: &str,
) -> Result<VaultData, VaultError> {
    let path_buf = PathBuf::from(&path);
    let (data, key, salt) = crate::vault::open_vault(&path_buf, password)?;

    *state.session.lock().unwrap() = Some(VaultSession {
        data: data.clone(),
        key,
        salt,
    });
    *state.active_path.lock().unwrap() = Some(path_buf);
    Ok(data)
}

#[tauri::command]
pub fn lock_vault(state: State<'_, AppState>) -> Result<(), VaultError> {
    // Dropping the session automatically zeroizes the key in memory!
    *state.session.lock().unwrap() = None;
    Ok(())
}

#[tauri::command]
pub fn unlock_vault(state: State<'_, AppState>, password: &str) -> Result<VaultData, VaultError> {
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard
        .as_ref()
        .ok_or_else(|| VaultError::CorruptedVault("No active path".into()))?
        .clone();
    drop(path_guard); // Release lock before opening

    let (data, key, salt) = crate::vault::open_vault(&path, password)?;
    *state.session.lock().unwrap() = Some(VaultSession {
        data: data.clone(),
        key,
        salt,
    });
    Ok(data)
}

#[tauri::command]
pub fn close_vault(state: State<'_, AppState>) -> Result<(), VaultError> {
    *state.session.lock().unwrap() = None;
    *state.active_path.lock().unwrap() = None; // Clears remembered path (back to home)
    Ok(())
}

#[tauri::command]
pub fn get_vault_state(state: State<'_, AppState>) -> Result<VaultStateResponse, VaultError> {
    let is_unlocked = state.session.lock().unwrap().is_some();
    let path_guard = state.active_path.lock().unwrap();

    let file_name = path_guard
        .as_ref()
        .and_then(|p| p.file_name())
        .map(|f| f.to_string_lossy().to_string());

    Ok(VaultStateResponse {
        is_unlocked,
        vault_name: file_name.clone(), // In future, can be extracted from settings
        file_name,
    })
}

#[tauri::command]
pub fn change_master_password(
    app: AppHandle,
    state: State<'_, AppState>,
    old_password: &str,
    new_password: &str,
) -> Result<(), VaultError> {
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?.clone();
    drop(path_guard); // Free lock for UI responsiveness

    let _ = app.emit(
        "master-password-progress",
        ProgressPayload {
            stage: "verifying".into(),
            percent: 10,
        },
    );

    // Verify old password by attempting to decrypt the file header
    let (data, _, _) = crate::vault::open_vault(&path, old_password)?;

    let _ = app.emit(
        "master-password-progress",
        ProgressPayload {
            stage: "deriving".into(),
            percent: 40,
        },
    );
    let new_salt = crate::crypto::random::generate_salt()?;
    let new_key = crate::crypto::kdf::derive_key(new_password, &new_salt)?;

    let _ = app.emit(
        "master-password-progress",
        ProgressPayload {
            stage: "re-encrypting & writing".into(),
            percent: 80,
        },
    );
    crate::vault::save_vault(&path, &data, &new_key, &new_salt)?;

    let _ = app.emit(
        "master-password-progress",
        ProgressPayload {
            stage: "done".into(),
            percent: 100,
        },
    );

    // Update active session with new keys
    *state.session.lock().unwrap() = Some(VaultSession {
        data,
        key: new_key,
        salt: new_salt,
    });

    Ok(())
}
