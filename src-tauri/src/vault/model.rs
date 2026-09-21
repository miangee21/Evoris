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
    Totp,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultItem {
    pub id: String,
    pub category_id: Option<String>,
    pub name: String,
    pub fields: Vec<VaultField>,
    pub totp: Option<TotpConfig>,
    pub created_at: String,
    pub updated_at: String,
    pub is_favorite: bool,
    pub in_trash: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultConfig {
    pub lock_timeout_minutes: u32,
    pub theme: String,
    pub accent: String,
    pub navigation_mode: String,
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
