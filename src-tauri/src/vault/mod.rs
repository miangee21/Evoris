//src-tauri/src/vault/mod.rs
pub mod format;
pub mod io;
pub mod model;
pub mod validate;

use crate::crypto::{cipher, kdf, random, zeroize};
use crate::error::VaultError;
use model::VaultData;
use std::path::Path;

/// Opens and decrypts an existing vault file.
///
/// # Errors
/// Returns `VaultError` if file reading, decryption, parsing, or semantic validation fails.
pub fn open_vault(
    path: &Path,
    password: &str,
) -> Result<(VaultData, kdf::DerivedKey, [u8; 16]), VaultError> {
    let bytes = io::read_vault_file(path)?;
    let container = format::parse_container(&bytes)?;
    let key = kdf::derive_key(password, &container.salt)?;
    let aad = format::header_bytes(&container);

    let mut plaintext = cipher::decrypt(&key, &container.nonce, &container.ciphertext, &aad)?;
    let data: VaultData = serde_json::from_slice(&plaintext)?;
    zeroize::scrub(&mut plaintext); // Memory wipe

    validate::validate_vault(&data)?;

    Ok((data, key, container.salt))
}

/// Validates, encrypts, and atomically saves a vault.
///
/// # Errors
/// Returns `VaultError` if validation, serialization, encryption, or atomic I/O fails.
pub fn save_vault(
    path: &Path,
    data: &VaultData,
    key: &kdf::DerivedKey,
    salt: &[u8; 16],
) -> Result<(), VaultError> {
    validate::validate_vault(data)?;

    let mut plaintext = serde_json::to_vec(data)?;
    let nonce = random::generate_nonce()?;

    let dummy = format::Container {
        magic: *format::MAGIC_BYTES,
        version: format::FORMAT_VERSION,
        salt: *salt,
        nonce,
        ciphertext: vec![],
    };
    let aad = format::header_bytes(&dummy);

    let ciphertext = cipher::encrypt(key, &nonce, &plaintext, &aad)?;
    zeroize::scrub(&mut plaintext); // Memory wipe

    let final_bytes = format::write_container(salt, &nonce, &ciphertext);
    io::write_vault_file_atomic(path, &final_bytes)?;

    Ok(())
}

/// Creates a new, empty vault file with a fresh salt and key.
///
/// # Errors
/// Returns `VaultError` if key derivation, encryption, or file writing fails.
pub fn create_vault(
    path: &Path,
    password: &str,
) -> Result<(VaultData, kdf::DerivedKey, [u8; 16]), VaultError> {
    let data = VaultData {
        categories: vec![],
        items: vec![],
    };
    let salt = random::generate_salt()?;
    let key = kdf::derive_key(password, &salt)?;

    save_vault(path, &data, &key, &salt)?;

    Ok((data, key, salt))
}

/// Changes the master password by generating a new salt, deriving a new key, and re-encrypting.
///
/// # Errors
/// Returns `VaultError` if key derivation, encryption, or atomic writing fails.
pub fn change_master_password(
    path: &Path,
    data: &VaultData,
    new_password: &str,
) -> Result<(kdf::DerivedKey, [u8; 16]), VaultError> {
    let new_salt = random::generate_salt()?;
    let new_key = kdf::derive_key(new_password, &new_salt)?;

    save_vault(path, data, &new_key, &new_salt)?;

    // The old key is dropped out of scope and automatically zeroized
    Ok((new_key, new_salt))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::error::VaultError;
    use crate::vault::model::{VaultData, VaultItem};
    use std::env;
    use std::fs;
    use uuid::Uuid;

    // Helper to generate a unique temp file path for each test
    fn temp_file() -> std::path::PathBuf {
        env::temp_dir().join(format!("{}.evs", Uuid::new_v4()))
    }

    #[test]
    fn test_create_open_roundtrip() {
        let path = temp_file();
        let (created, _, _) = create_vault(&path, "correct_pass").unwrap();
        let (opened, _, _) = open_vault(&path, "correct_pass").unwrap();

        assert_eq!(created.items.len(), 0);
        assert_eq!(opened.items.len(), 0);
        let _ = fs::remove_file(path);
    }

    #[test]
    fn test_wrong_password() {
        let path = temp_file();
        create_vault(&path, "correct").unwrap();

        let result = open_vault(&path, "wrong");
        // A wrong password triggers a MAC authentication failure (CryptoError)
        assert!(matches!(result, Err(VaultError::CryptoError(_))));

        let _ = fs::remove_file(path);
    }

    #[test]
    fn test_wrong_magic() {
        let path = temp_file();
        create_vault(&path, "pass").unwrap();

        let mut bytes = fs::read(&path).unwrap();
        bytes[0] = b'X'; // Corrupt the magic bytes (EVOR -> XVOR)
        fs::write(&path, &bytes).unwrap();

        let result = open_vault(&path, "pass");
        assert!(matches!(result, Err(VaultError::NotAnEvorisFile)));

        let _ = fs::remove_file(path);
    }

    #[test]
    fn test_truncated_file() {
        let path = temp_file();
        fs::write(&path, b"EVOR\x01short").unwrap(); // Too short to have salt/nonce

        let result = open_vault(&path, "pass");
        assert!(matches!(result, Err(VaultError::CorruptedVault(_))));

        let _ = fs::remove_file(path);
    }

    #[test]
    fn test_missing_category_validation() {
        let mut data = VaultData {
            categories: vec![],
            items: vec![],
        };
        data.items.push(VaultItem {
            id: "item1".into(),
            category_id: Some("missing_cat".into()), // Points to non-existent category
            name: "Test".into(),
            fields: vec![],
            created_at: 0,
            updated_at: 0,
            is_favorite: false,
            in_trash: false,
        });

        let err = validate::validate_vault(&data).unwrap_err();
        assert!(matches!(err, VaultError::CorruptedVault(_)));
    }

    #[test]
    fn test_change_master_password() {
        let path = temp_file();
        let (data, _, _) = create_vault(&path, "old_pass").unwrap();

        change_master_password(&path, &data, "new_pass").unwrap();

        assert!(open_vault(&path, "old_pass").is_err());
        assert!(open_vault(&path, "new_pass").is_ok());

        let _ = fs::remove_file(path);
    }

    #[test]
    fn test_atomic_write_failure_leaves_original_intact() {
        let path = temp_file();
        fs::write(&path, b"original_data").unwrap();

        let mut temp_path = path.clone();
        temp_path.set_extension("evs.tmp");

        // Create a directory where the temp file should go, forcing a guaranteed I/O error
        fs::create_dir(&temp_path).unwrap();

        let err = io::write_vault_file_atomic(&path, b"new_data").unwrap_err();
        assert!(matches!(err, VaultError::IoError(_)));

        // Original file must remain completely untouched
        let content = fs::read(&path).unwrap();
        assert_eq!(content, b"original_data");

        let _ = fs::remove_dir(temp_path);
        let _ = fs::remove_file(path);
    }
}
