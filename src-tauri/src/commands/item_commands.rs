//src-tauri/src/commands/item_commands.rs
use crate::commands::now;
use crate::error::VaultError;
use crate::state::AppState;
use crate::vault::model::VaultItem;
use tauri::State;

#[tauri::command]
pub fn list_items(state: State<'_, AppState>) -> Result<Vec<VaultItem>, VaultError> {
    let session_guard = state.session.lock().unwrap();
    let session = session_guard.as_ref().ok_or(VaultError::VaultLocked)?;
    // Return only active items (not in trash)
    Ok(session
        .data
        .items
        .iter()
        .filter(|i| !i.in_trash)
        .cloned()
        .collect())
}

#[tauri::command]
pub fn create_item(
    state: State<'_, AppState>,
    mut item: VaultItem,
) -> Result<VaultItem, VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    item.created_at = now().to_string();
    item.updated_at.clone_from(&item.created_at);
    item.in_trash = false;

    session.data.items.push(item.clone());

    let save_result = (|| -> Result<(), VaultError> {
        crate::vault::validate::validate_vault(&session.data)?;
        crate::vault::save_vault(path, &session.data, &session.key, &session.salt)?;
        Ok(())
    })();

    if let Err(e) = save_result {
        session.data.items.pop();
        return Err(e);
    }

    Ok(item)
}

#[tauri::command]
pub fn update_item(
    state: State<'_, AppState>,
    mut item: VaultItem,
) -> Result<VaultItem, VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    item.updated_at = now().to_string();

    let item_index = session
        .data
        .items
        .iter()
        .position(|i| i.id == item.id)
        .ok_or_else(|| VaultError::CorruptedVault("Item not found".into()))?;

    let backup = session.data.items[item_index].clone();
    session.data.items[item_index] = item.clone();

    let save_result = (|| -> Result<(), VaultError> {
        crate::vault::validate::validate_vault(&session.data)?;
        crate::vault::save_vault(path, &session.data, &session.key, &session.salt)?;
        Ok(())
    })();

    if let Err(e) = save_result {
        session.data.items[item_index] = backup;
        return Err(e);
    }

    Ok(item)
}

#[tauri::command]
pub fn delete_item(state: State<'_, AppState>, id: String) -> Result<(), VaultError> {
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

    let backup_trash_state = session.data.items[item_index].in_trash;
    let backup_updated_at = session.data.items[item_index].updated_at.clone();

    // Move to trash (Soft Delete)
    session.data.items[item_index].in_trash = true;
    session.data.items[item_index].updated_at = now().to_string();

    let save_result = (|| -> Result<(), VaultError> {
        crate::vault::validate::validate_vault(&session.data)?;
        crate::vault::save_vault(path, &session.data, &session.key, &session.salt)?;
        Ok(())
    })();

    if let Err(e) = save_result {
        session.data.items[item_index].in_trash = backup_trash_state;
        session.data.items[item_index].updated_at = backup_updated_at;
        return Err(e);
    }

    Ok(())
}
