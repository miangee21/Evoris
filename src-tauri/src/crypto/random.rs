//src-tauri/src/crypto/random.rs
use crate::crypto::CryptoError;

/// Generates random bytes using the OS CSPRNG.
///
/// # Errors
/// Returns `CryptoError::RandomFailed` if the underlying OS entropy source fails.
pub fn random_bytes<const N: usize>() -> Result<[u8; N], CryptoError> {
    let mut buf = [0u8; N];
    getrandom::fill(&mut buf).map_err(|_| CryptoError::RandomFailed)?;
    Ok(buf)
}

/// Generates a 16-byte random salt.
///
/// # Errors
/// Returns `CryptoError::RandomFailed` if random byte generation fails.
pub fn generate_salt() -> Result<[u8; 16], CryptoError> {
    random_bytes::<16>()
}

/// Generates a 12-byte random nonce for AES-GCM.
///
/// # Errors
/// Returns `CryptoError::RandomFailed` if random byte generation fails.
pub fn generate_nonce() -> Result<[u8; 12], CryptoError> {
    random_bytes::<12>()
}
