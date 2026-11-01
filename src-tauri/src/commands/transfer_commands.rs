//src-tauri/src/commands/transfer_commands.rs
use crate::error::VaultError;
use crate::state::{AppState, VaultSession};
use crate::vault::format::FORMAT_VERSION;
use crate::vault::model::{VaultCategory, VaultConfig, VaultData, VaultItem};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use tauri::State;
use uuid::Uuid;

pub const EXPORT_FORMAT: &str = "evoris-export";
pub const EXPORT_FORMAT_VERSION: u32 = 1;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ExportPayload {
    pub format: String,
    pub format_version: u32,
    pub exported_at: String,
    pub vault_name: String,
    pub categories: Vec<VaultCategory>,
    pub items: Vec<VaultItem>,
    pub trash: Vec<VaultItem>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportSummary {
    pub vault_name: String,
    pub item_count: usize,
    pub category_count: usize,
    pub trash_count: usize,
}

fn invalid_import() -> VaultError {
    VaultError::CorruptedVault("Invalid import format".into())
}

fn default_settings() -> VaultConfig {
    VaultConfig {
        navigation_mode: String::from("top-bar-only"),
        auto_lock_enabled: true,
        lock_timeout_seconds: 30,
    }
}

fn unix_to_iso8601(secs: u64) -> String {
    let days = secs / 86_400;
    let secs_of_day = secs % 86_400;
    let z = days + 719_468;
    let era = z / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = if mp < 10 { mp + 3 } else { mp - 9 };
    let year = if month <= 2 { y + 1 } else { y };
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        secs_of_day / 3600,
        (secs_of_day / 60) % 60,
        secs_of_day % 60
    )
}

fn is_iso8601(value: &str) -> bool {
    value.len() >= 20 && value.as_bytes().get(10) == Some(&b'T')
}

fn validate_totp_secret(secret: &str) -> Result<(), VaultError> {
    let normalized: String = secret
        .chars()
        .filter(|c| !c.is_whitespace())
        .flat_map(char::to_uppercase)
        .collect();
    if normalized.is_empty() {
        return Err(invalid_import());
    }
    let non_empty: fn(Vec<u8>) -> Option<Vec<u8>> =
        |bytes| if bytes.is_empty() { None } else { Some(bytes) };
    let padded = base32::decode(base32::Alphabet::Rfc4648 { padding: true }, &normalized);
    let unpadded = base32::decode(base32::Alphabet::Rfc4648 { padding: false }, &normalized);
    if padded
        .and_then(non_empty)
        .or_else(|| unpadded.and_then(non_empty))
        .is_some()
    {
        Ok(())
    } else {
        Err(invalid_import())
    }
}

fn load_and_validate_import(path: &str) -> Result<ExportPayload, VaultError> {
    let text = std::fs::read_to_string(path).map_err(|_| invalid_import())?;
    let payload: ExportPayload = serde_json::from_str(&text).map_err(|_| invalid_import())?;
    if payload.format != EXPORT_FORMAT || payload.format_version != EXPORT_FORMAT_VERSION {
        return Err(invalid_import());
    }
    if payload.vault_name.trim().is_empty() || !is_iso8601(&payload.exported_at) {
        return Err(invalid_import());
    }
    let partitioned = payload
        .items
        .iter()
        .map(|i| (i, false))
        .chain(payload.trash.iter().map(|i| (i, true)));
    for (item, in_trash) in partitioned {
        if item.in_trash != in_trash || item.deleted_at.is_some() != in_trash {
            return Err(invalid_import());
        }
    }
    let mut all_items = payload.items.clone();
    all_items.extend(payload.trash.iter().cloned());
    for item in &all_items {
        if let Some(totp) = &item.totp {
            validate_totp_secret(&totp.secret)?;
        }
    }
    let reconstructed = VaultData {
        version: u32::from(FORMAT_VERSION),
        settings: default_settings(),
        categories: payload.categories.clone(),
        items: all_items,
        created_at: payload.exported_at.clone(),
        updated_at: payload.exported_at.clone(),
    };
    crate::vault::validate::validate_vault(&reconstructed)?;
    Ok(payload)
}

fn write_file_atomic(path: &str, bytes: &[u8]) -> Result<(), VaultError> {
    let tmp_path = format!("{path}.tmp");
    let result = (|| -> std::io::Result<()> {
        use std::io::Write;
        let mut file = std::fs::File::create(&tmp_path)?;
        file.write_all(bytes)?;
        file.sync_all()?;
        Ok(())
    })();
    match result {
        Ok(()) => {
            std::fs::rename(&tmp_path, path)?;
            Ok(())
        }
        Err(e) => {
            let _ = std::fs::remove_file(&tmp_path);
            Err(VaultError::IoError(e))
        }
    }
}

#[tauri::command]
pub fn export_vault_json(state: State<'_, AppState>, path: String) -> Result<(), VaultError> {
    if path.trim().is_empty() {
        return Err(VaultError::IoError(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "Empty export path",
        )));
    }
    let session_guard = crate::state::lock_guard(&state.session)?;
    let session = session_guard.as_ref().ok_or(VaultError::VaultLocked)?;
    let vault_name = crate::state::lock_guard(&state.active_path)?
        .as_ref()
        .and_then(|p| p.file_stem())
        .map_or_else(
            || String::from("Evoris"),
            |s| s.to_string_lossy().into_owned(),
        );
    let payload = ExportPayload {
        format: EXPORT_FORMAT.to_string(),
        format_version: EXPORT_FORMAT_VERSION,
        exported_at: unix_to_iso8601(crate::commands::now()),
        vault_name,
        categories: session.data.categories.clone(),
        items: session
            .data
            .items
            .iter()
            .filter(|i| !i.in_trash)
            .cloned()
            .collect(),
        trash: session
            .data
            .items
            .iter()
            .filter(|i| i.in_trash)
            .cloned()
            .collect(),
    };
    let json = serde_json::to_string_pretty(&payload).map_err(VaultError::ParseError)?;
    write_file_atomic(&path, json.as_bytes())
}

#[tauri::command]
pub fn read_import_file(path: String) -> Result<ImportSummary, VaultError> {
    let payload = load_and_validate_import(&path)?;
    Ok(ImportSummary {
        vault_name: payload.vault_name,
        item_count: payload.items.len(),
        category_count: payload.categories.len(),
        trash_count: payload.trash.len(),
    })
}

#[tauri::command]
pub fn create_vault_from_import(
    state: State<'_, AppState>,
    path: String,
    import_path: String,
    new_vault_name: String,
    password: String,
) -> Result<VaultData, VaultError> {
    if path.trim().is_empty() || import_path.trim().is_empty() || password.is_empty() {
        return Err(invalid_import());
    }
    if new_vault_name.len() > 40
        || new_vault_name.is_empty()
        || !new_vault_name.chars().all(|c| c.is_ascii_alphanumeric())
    {
        return Err(invalid_import());
    }
    let payload = load_and_validate_import(&import_path)?;
    let mut category_id_map: HashMap<String, String> = HashMap::new();
    let categories: Vec<VaultCategory> = payload
        .categories
        .iter()
        .map(|c| {
            let new_id = Uuid::new_v4().to_string();
            category_id_map.insert(c.id.clone(), new_id.clone());
            VaultCategory {
                id: new_id,
                ..c.clone()
            }
        })
        .collect();

    let remap_items = |items: &[VaultItem]| -> Vec<VaultItem> {
        items
            .iter()
            .map(|item| VaultItem {
                id: Uuid::new_v4().to_string(),
                category_id: item
                    .category_id
                    .as_ref()
                    .and_then(|old| category_id_map.get(old).cloned()),
                fields: item
                    .fields
                    .iter()
                    .map(|f| {
                        let mut f = f.clone();
                        f.id = Uuid::new_v4().to_string();
                        f
                    })
                    .collect(),
                attachments: item
                    .attachments
                    .iter()
                    .map(|a| {
                        let mut a = a.clone();
                        a.id = Uuid::new_v4().to_string();
                        if a.created_at.is_empty() {
                            a.created_at = crate::commands::now().to_string();
                        }
                        a
                    })
                    .collect(),
                ..item.clone()
            })
            .collect()
    };
    let mut items = remap_items(&payload.items);
    items.extend(remap_items(&payload.trash));
    let now = crate::commands::now().to_string();
    let data = VaultData {
        version: u32::from(FORMAT_VERSION),
        settings: default_settings(),
        categories,
        items,
        created_at: now.clone(),
        updated_at: now,
    };
    crate::vault::validate::validate_vault(&data)?;
    let path_buf = PathBuf::from(&path);
    let salt = crate::crypto::random::generate_salt()?;
    let key = crate::crypto::kdf::derive_key(&password, &salt)?;
    crate::vault::save_vault(&path_buf, &data, &key, &salt)?;
    *crate::state::lock_guard(&state.session)? = Some(VaultSession {
        data: data.clone(),
        key,
        salt,
    });
    *crate::state::lock_guard(&state.active_path)? = Some(path_buf);
    Ok(data)
}
