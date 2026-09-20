//src-tauri/src/crypto/kdf.rs
use crate::crypto::CryptoError;
use argon2::{Algorithm, Argon2, Params, Version};
use zeroize::{Zeroize, ZeroizeOnDrop};

const ARGON2_MEMORY_KIB: u32 = 65_536; // 64 MiB
const ARGON2_ITERATIONS: u32 = 3;
const ARGON2_PARALLELISM: u32 = 4;
const DERIVED_KEY_LENGTH: usize = 32; // 256-bit key for AES-256

#[derive(Zeroize, ZeroizeOnDrop)]
pub struct DerivedKey(pub [u8; DERIVED_KEY_LENGTH]);

/// Derives a key from a password and salt using Argon2id.
///
/// # Errors
/// Returns `CryptoError::KdfFailed` if Argon2id parameters are invalid or hashing fails.
pub fn derive_key(password: &str, salt: &[u8; 16]) -> Result<DerivedKey, CryptoError> {
    let params = Params::new(
        ARGON2_MEMORY_KIB,
        ARGON2_ITERATIONS,
        ARGON2_PARALLELISM,
        Some(DERIVED_KEY_LENGTH),
    )
    .map_err(|_| CryptoError::KdfFailed)?;

    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);
    let mut key = DerivedKey([0u8; DERIVED_KEY_LENGTH]);

    argon2
        .hash_password_into(password.as_bytes(), salt, &mut key.0)
        .map_err(|_| CryptoError::KdfFailed)?;

    Ok(key)
}
