//src-tauri/src/commands/mod.rs
pub mod category_commands;
pub mod item_commands;
pub mod settings_commands;
pub mod transfer_commands;
pub mod trash_commands;
pub mod vault_commands;

use std::time::{SystemTime, UNIX_EPOCH};

/// Helper to get current Unix timestamp in seconds
///
/// # Panics
/// Panics if the system clock is set before the `UNIX_EPOCH`.
#[must_use]
pub fn now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}
