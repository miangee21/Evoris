//src-tauri/src/vault/io.rs
use crate::error::VaultError;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::path::Path;

/// Reads the entire vault file bytes into memory.
///
/// # Errors
/// Returns `VaultError::IoError` if the file cannot be read from disk.
pub fn read_vault_file(path: &Path) -> Result<Vec<u8>, VaultError> {
    let mut file = File::open(path)?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;
    Ok(buffer)
}

/// Safely writes data to a temporary file, syncs it to disk, and renames it over the original.
///
/// # Errors
/// Returns `VaultError::IoError` if any file operation fails during the atomic write.
pub fn write_vault_file_atomic(path: &Path, bytes: &[u8]) -> Result<(), VaultError> {
    let mut temp_path = path.to_path_buf();
    temp_path.set_extension("evs.tmp");

    let write_result = (|| -> std::io::Result<()> {
        let mut temp_file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&temp_path)?;
        temp_file.write_all(bytes)?;
        temp_file.sync_all()?; // Force flush to disk hardware
        Ok(())
    })();

    match write_result {
        Ok(()) => {
            std::fs::rename(&temp_path, path).map_err(VaultError::IoError)?;
            Ok(())
        }
        Err(e) => {
            // Clean up the temp file silently if the atomic write failed
            let _ = std::fs::remove_file(&temp_path);
            Err(VaultError::IoError(e))
        }
    }
}
