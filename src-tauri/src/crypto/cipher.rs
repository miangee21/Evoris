//src-tauri/src/crypto/cipher.rs
use crate::crypto::{kdf::DerivedKey, CryptoError};
use aes_gcm::{
    aead::{Aead, KeyInit, Payload},
    Aes256Gcm, Nonce,
};

/// Encrypts plaintext using AES-256-GCM.
///
/// # Errors
/// Returns `CryptoError::InvalidKeyLength` if the derived key length is incorrect.
/// Returns `CryptoError::EncryptionFailed` if encryption fails.
pub fn encrypt(
    key: &DerivedKey,
    nonce: &[u8; 12],
    plaintext: &[u8],
    aad: &[u8],
) -> Result<Vec<u8>, CryptoError> {
    let cipher = Aes256Gcm::new_from_slice(&key.0).map_err(|_| CryptoError::InvalidKeyLength)?;

    let nonce_obj = Nonce::from(*nonce);
    let payload = Payload {
        msg: plaintext,
        aad,
    };

    cipher
        .encrypt(&nonce_obj, payload)
        .map_err(|_| CryptoError::EncryptionFailed)
}

/// Decrypts ciphertext using AES-256-GCM.
///
/// # Errors
/// Returns `CryptoError::InvalidKeyLength` if the derived key length is incorrect.
/// Returns `CryptoError::DecryptionFailed` if authentication or decryption fails.
pub fn decrypt(
    key: &DerivedKey,
    nonce: &[u8; 12],
    ciphertext: &[u8],
    aad: &[u8],
) -> Result<Vec<u8>, CryptoError> {
    let cipher = Aes256Gcm::new_from_slice(&key.0).map_err(|_| CryptoError::InvalidKeyLength)?;

    let nonce_obj = Nonce::from(*nonce);
    let payload = Payload {
        msg: ciphertext,
        aad,
    };

    // A failed auth tag strictly maps to DecryptionFailed as per instructions
    cipher
        .decrypt(&nonce_obj, payload)
        .map_err(|_| CryptoError::DecryptionFailed)
}
