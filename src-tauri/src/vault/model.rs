//src-tauri/src/vault/model.rs
use serde::{Deserialize, Serialize};
// Memory zeroization is handled at the buffer level in mod.rs orchestration

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum FieldType {
    Text,
    Password,
    Email,
    Url,
    Notes,
    Heading,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TotpConfig {
    pub secret: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultField {
    pub id: String,
    pub r#type: FieldType,
    pub label: String,
    pub value: String,
    pub masked: bool,
    pub order: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultCategory {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub color: String,
    pub created_at: String,
    pub updated_at: String,
}

/// A file stored inside the encrypted vault (never on disk outside it,
/// except on explicit user Download). `data_base64` is the raw file bytes
/// base64-encoded; `mime_type` is the browser File.type verbatim and may be
/// "" for unknown types. `created_at` follows the other timestamps: a
/// unix-seconds string set by Rust (see `item_commands`), never trusted
/// for ordering or security.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultAttachment {
    pub id: String,
    pub file_name: String,
    pub mime_type: String,
    pub size_bytes: u64,
    pub data_base64: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultItem {
    pub id: String,
    pub category_id: Option<String>,
    pub name: String,
    pub fields: Vec<VaultField>,
    pub totp: Option<TotpConfig>,
    /// `default` so old .evs files written before attachments existed
    /// still open in the new app. (The reverse is not true: new files
    /// with attachments do not open in the old app, whose
    /// `deny_unknown_fields` rejects the field — accepted, v1 has no
    /// released files to preserve.)
    #[serde(default)]
    pub attachments: Vec<VaultAttachment>,
    pub created_at: String,
    pub updated_at: String,
    pub is_favorite: bool,
    pub in_trash: bool,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultConfig {
    pub navigation_mode: String,
    pub auto_lock_enabled: bool,
    pub lock_timeout_seconds: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultData {
    pub version: u32,
    pub settings: VaultConfig,
    pub categories: Vec<VaultCategory>,
    pub items: Vec<VaultItem>,
    pub created_at: String,
    pub updated_at: String,
}
