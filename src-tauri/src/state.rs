//src-tauri/src/state.rs
use crate::crypto::kdf::DerivedKey;
use crate::error::VaultError;
use crate::vault::model::VaultData;
use std::path::PathBuf;
use std::sync::{Mutex, MutexGuard};
use zeroize::Zeroize;

pub struct VaultSession {
    pub data: VaultData,
    pub key: DerivedKey,
    pub salt: [u8; 16],
}

impl Drop for VaultSession {
    fn drop(&mut self) {
        // Key is automatically zeroized via ZeroizeOnDrop in kdf.rs
        // We zeroize the salt just in case
        self.salt.zeroize();
        // Clear collections to aggressively scrub plaintext data from RAM
        self.data.categories.clear();
        self.data.items.clear();
    }
}

#[derive(Default)]
pub struct AppState {
    pub session: Mutex<Option<VaultSession>>,
    pub active_path: Mutex<Option<PathBuf>>, // Stored separately for lock/unlock continuity
}

/// Single lock helper for all commands. A poisoned mutex is a real error,
/// never a panic: commands must return `VaultError::InternalError`.
///
/// # Errors
///
/// Returns [`VaultError::InternalError`] if the mutex lock is poisoned.
pub fn lock_guard<T>(mutex: &Mutex<T>) -> Result<MutexGuard<'_, T>, VaultError> {
    mutex.lock().map_err(|_| VaultError::InternalError)
}
