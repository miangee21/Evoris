//src-tauri/src/state.rs
use crate::crypto::kdf::DerivedKey;
use crate::vault::model::VaultData;
use std::path::PathBuf;
use std::sync::Mutex;
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
