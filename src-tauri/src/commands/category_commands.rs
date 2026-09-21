//src-tauri/src/commands/category_commands.rs
use crate::commands::now;
use crate::error::VaultError;
use crate::state::AppState;
use crate::vault::model::VaultCategory;
use tauri::State;

#[tauri::command]
pub fn list_categories(state: State<'_, AppState>) -> Result<Vec<VaultCategory>, VaultError> {
    let session_guard = state.session.lock().unwrap();
    let session = session_guard.as_ref().ok_or(VaultError::VaultLocked)?;
    Ok(session.data.categories.clone())
}

#[tauri::command]
pub fn create_category(
    state: State<'_, AppState>,
    mut category: VaultCategory,
) -> Result<VaultCategory, VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    category.created_at = now().to_string();
    category.updated_at.clone_from(&category.created_at);

    // Mutate in-memory
    session.data.categories.push(category.clone());

    // Validate and Save
    let save_result = (|| -> Result<(), VaultError> {
        crate::vault::validate::validate_vault(&session.data)?;
        crate::vault::save_vault(path, &session.data, &session.key, &session.salt)?;
        Ok(())
    })();

    if let Err(e) = save_result {
        // Rollback on failure
        session.data.categories.pop();
        return Err(e);
    }

    Ok(category)
}

#[tauri::command]
pub fn update_category(
    state: State<'_, AppState>,
    mut category: VaultCategory,
) -> Result<VaultCategory, VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    category.updated_at = now().to_string();

    let cat_index = session
        .data
        .categories
        .iter()
        .position(|c| c.id == category.id)
        .ok_or_else(|| VaultError::CorruptedVault("Category not found".into()))?;

    let backup = session.data.categories[cat_index].clone();

    // Mutate in-memory
    session.data.categories[cat_index] = category.clone();

    let save_result = (|| -> Result<(), VaultError> {
        crate::vault::validate::validate_vault(&session.data)?;
        crate::vault::save_vault(path, &session.data, &session.key, &session.salt)?;
        Ok(())
    })();

    if let Err(e) = save_result {
        // Rollback on failure
        session.data.categories[cat_index] = backup;
        return Err(e);
    }

    Ok(category)
}

#[tauri::command]
pub fn delete_category(state: State<'_, AppState>, id: String) -> Result<(), VaultError> {
    let mut session_guard = state.session.lock().unwrap();
    let session = session_guard.as_mut().ok_or(VaultError::VaultLocked)?;
    let path_guard = state.active_path.lock().unwrap();
    let path = path_guard.as_ref().ok_or(VaultError::VaultLocked)?;

    let cat_index = session
        .data
        .categories
        .iter()
        .position(|c| c.id == id)
        .ok_or_else(|| VaultError::CorruptedVault("Category not found".into()))?;

    let removed_cat = session.data.categories.remove(cat_index);

    // Hard delete category and cascade nullify item.category_id
    let mut affected_items = Vec::new();
    for item in &mut session.data.items {
        if item.category_id.as_ref() == Some(&id) {
            affected_items.push((item.id.clone(), item.category_id.clone()));
            item.category_id = None;
            item.updated_at = now().to_string();
        }
    }

    let save_result = (|| -> Result<(), VaultError> {
        crate::vault::validate::validate_vault(&session.data)?;
        crate::vault::save_vault(path, &session.data, &session.key, &session.salt)?;
        Ok(())
    })();

    if let Err(e) = save_result {
        // Rollback category and affected items on failure
        session.data.categories.insert(cat_index, removed_cat);
        for backup in affected_items {
            if let Some(item) = session.data.items.iter_mut().find(|i| i.id == backup.0) {
                item.category_id = backup.1;
            }
        }
        return Err(e);
    }

    Ok(())
}
