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
pub struct VaultField {
    pub id: String,
    pub r#type: FieldType,
    pub label: String,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultCategory {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub color: String,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultItem {
    pub id: String,
    pub category_id: Option<String>,
    pub name: String,
    pub fields: Vec<VaultField>,
    pub created_at: u64,
    pub updated_at: u64,
    pub is_favorite: bool,
    pub in_trash: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VaultData {
    pub categories: Vec<VaultCategory>,
    pub items: Vec<VaultItem>,
}
