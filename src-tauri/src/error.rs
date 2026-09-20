//src-tauri/src/error.rs
use crate::crypto::CryptoError;
use serde::{Serialize, Serializer};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum VaultError {
    #[error("File is not a valid Evoris vault")]
    NotAnEvorisFile,
    #[error("Vault is locked")]
    VaultLocked,
    #[error("Unsupported vault version")]
    UnsupportedVaultVersion,
    #[error("Vault file is corrupted or tampered: {0}")]
    CorruptedVault(String),
    #[error("Invalid master password")]
    InvalidMasterPassword,
    #[error("I/O error occurred")]
    IoError(#[from] std::io::Error),
    #[error("Crypto error occurred: {0}")]
    CryptoError(#[from] CryptoError),
    #[error("Failed to parse vault data: {0}")]
    ParseError(#[from] serde_json::Error),
}

impl Serialize for VaultError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut state = serializer.serialize_struct("VaultError", 2)?;

        // Strictly map to Step 3.6 error codes
        let code = match self {
            VaultError::NotAnEvorisFile => "NOT_AN_EVORIS_FILE",
            VaultError::UnsupportedVaultVersion => "UNSUPPORTED_VERSION",
            VaultError::VaultLocked => "VAULT_LOCKED",
            VaultError::CorruptedVault(_) => "CORRUPTED_VAULT",
            VaultError::InvalidMasterPassword
            | VaultError::CryptoError(CryptoError::DecryptionFailed) => "INVALID_MASTER_PASSWORD",
            VaultError::IoError(_) => "IO_ERROR",
            VaultError::CryptoError(_) => "CRYPTO_ERROR",
            VaultError::ParseError(_) => "PARSE_ERROR",
        };

        state.serialize_field("code", code)?;

        // Never leak file paths or sensitive password data in error messages
        let msg = match self {
            VaultError::IoError(_) => "File system I/O error occurred.".to_string(),
            _ => self.to_string(),
        };

        state.serialize_field("message", &msg)?;
        state.end()
    }
}
