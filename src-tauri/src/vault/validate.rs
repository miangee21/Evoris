//src-tauri/src/vault/validate.rs
use crate::error::VaultError;
use crate::vault::model::VaultData;
use std::collections::HashSet;

/// Performs semantic validation on the vault data structure
///
/// # Errors
/// Returns `VaultError::CorruptedVault` if data fails semantic rules (e.g., missing IDs).
pub fn validate_vault(data: &VaultData) -> Result<(), VaultError> {
    let mut cat_ids = HashSet::new();

    // Validate Categories
    for cat in &data.categories {
        if cat.name.trim().is_empty() {
            return Err(VaultError::CorruptedVault("Empty category name".into()));
        }
        if !cat_ids.insert(&cat.id) {
            return Err(VaultError::CorruptedVault("Duplicate category ID".into()));
        }
    }

    let mut item_ids = HashSet::new();

    // Validate Items
    for item in &data.items {
        if item.name.trim().is_empty() {
            return Err(VaultError::CorruptedVault("Empty item name".into()));
        }
        if !item_ids.insert(&item.id) {
            return Err(VaultError::CorruptedVault("Duplicate item ID".into()));
        }
        if let Some(cat_id) = &item.category_id {
            if !cat_ids.contains(cat_id) {
                return Err(VaultError::CorruptedVault(
                    "Item references non-existent category".into(),
                ));
            }
        }

        let mut field_ids = HashSet::new();
        for field in &item.fields {
            if !field_ids.insert(&field.id) {
                return Err(VaultError::CorruptedVault(
                    "Duplicate field ID within item".into(),
                ));
            }
        }

        let mut attachment_ids = HashSet::new();
        for attachment in &item.attachments {
            if !attachment_ids.insert(&attachment.id) {
                return Err(VaultError::CorruptedVault(
                    "Duplicate attachment ID within item".into(),
                ));
            }
        }
    }

    Ok(())
}
