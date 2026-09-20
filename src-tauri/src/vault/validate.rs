//src-tauri/src/vault/validate.rs
use crate::error::VaultError;
use crate::vault::model::{FieldType, VaultData};
use base32::Alphabet;
use std::collections::HashSet;

/// Performs semantic validation on the vault data structure
///
/// # Errors
/// Returns `VaultError::CorruptedVault` if data fails semantic rules (e.g., missing IDs, invalid TOTP).
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
        if !cat_ids.contains(&item.category_id) {
            return Err(VaultError::CorruptedVault(
                "Item references non-existent category".into(),
            ));
        }

        let mut field_ids = HashSet::new();
        for field in &item.fields {
            if !field_ids.insert(&field.id) {
                return Err(VaultError::CorruptedVault(
                    "Duplicate field ID within item".into(),
                ));
            }

            // Validate TOTP Base32 secret strictly
            if field.r#type == FieldType::Totp {
                let secret = field.value.trim().replace(' ', ""); // Handle spaces
                if secret.is_empty() {
                    return Err(VaultError::CorruptedVault("Empty TOTP secret".into()));
                }

                // Base32 can be RFC4648 with or without padding
                let decoded_no_pad = base32::decode(Alphabet::Rfc4648 { padding: false }, &secret);
                let decoded_pad = base32::decode(Alphabet::Rfc4648 { padding: true }, &secret);

                if decoded_no_pad.is_none() && decoded_pad.is_none() {
                    return Err(VaultError::CorruptedVault(
                        "Invalid Base32 string in TOTP field".into(),
                    ));
                }
            }
        }
    }

    Ok(())
}
