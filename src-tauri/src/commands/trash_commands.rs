//src-tauri/src/commands/trash_commands.rs
use crate::commands::now;
use crate::error::VaultError;
use crate::state::AppState;
use crate::vault::model::VaultItem;
use tauri::State;

#[tauri::command]
pub fn list_trash(state: State<'_, AppState>) -> Result<Vec<VaultItem>, VaultError> {
    let session_guard = state.session.lock().unwrap();
    let session = session_guard.as_ref().ok_or(VaultError::VaultLocked)?;
    Ok(session
        .data
        .items
        .iter()
        .filter(|i| i.in_trash)
        .cloned()
        .collect())
}

#[tauri::command]
pub fn restore_item(state: State<'_, AppState>, id: String) -> Result<(), VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    let item_index = session
        .data
        .items
        .iter()
        .position(|i| i.id == id)
        .ok_or_else(|| VaultError::CorruptedVault("Item not found".into()))?;

    session.data.items[item_index].in_trash = false;
    session.data.items[item_index].updated_at = now();

    if let Err(e) = crate::vault::save_vault(path, &session.data, &session.key, &session.salt) {
        session.data.items[item_index].in_trash = true; // Rollback
        return Err(e);
    }
    Ok(())
}

#[tauri::command]
pub fn delete_item_permanently(state: State<'_, AppState>, id: String) -> Result<(), VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    let item_index = session
        .data
        .items
        .iter()
        .position(|i| i.id == id && i.in_trash)
        .ok_or_else(|| VaultError::CorruptedVault("Item not found in trash".into()))?;

    let removed = session.data.items.remove(item_index);

    if let Err(e) = crate::vault::save_vault(path, &session.data, &session.key, &session.salt) {
        session.data.items.insert(item_index, removed); // Rollback
        return Err(e);
    }
    Ok(())
}

#[tauri::command]
pub fn empty_trash(state: State<'_, AppState>) -> Result<(), VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    let backup_items = session.data.items.clone();
    session.data.items.retain(|i| !i.in_trash); // Remove all trashed items

    if let Err(e) = crate::vault::save_vault(path, &session.data, &session.key, &session.salt) {
        session.data.items = backup_items; // Rollback
        return Err(e);
    }
    Ok(())
}
