//src-tauri/src/crypto/mod.rs
pub mod cipher;
pub mod kdf;
pub mod random;
pub mod zeroize;

use thiserror::Error;

#[derive(Debug, Error)]
pub enum CryptoError {
    #[error("Failed to generate random bytes from OS CSPRNG")]
    RandomFailed,
    #[error("Key derivation failed (Argon2id)")]
    KdfFailed,
    #[error("Encryption failed")]
    EncryptionFailed,
    #[error("Decryption failed or authentication tag mismatch")]
    DecryptionFailed,
    #[error("Invalid key length provided to cipher")]
    InvalidKeyLength,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::crypto::cipher::{decrypt, encrypt};
    use crate::crypto::kdf::derive_key;
    use crate::crypto::random::{generate_nonce, generate_salt};

    #[test]
    fn test_round_trip() {
        let password = "master_password_123!";
        let salt = generate_salt().unwrap();
        let nonce = generate_nonce().unwrap();
        let aad = b"EVOR\x01"; // Header mock (magic + version)

        let key = derive_key(password, &salt).unwrap();
        let plaintext = b"Secret Vault Data";

        let ciphertext = encrypt(&key, &nonce, plaintext, aad).unwrap();
        let decrypted = decrypt(&key, &nonce, &ciphertext, aad).unwrap();

        assert_eq!(plaintext.as_slice(), decrypted.as_slice());
    }

    #[test]
    fn test_wrong_key_fails() {
        let salt = generate_salt().unwrap();
        let nonce = generate_nonce().unwrap();
        let aad = b"EVOR\x01";

        let key1 = derive_key("correct_password", &salt).unwrap();
        let key2 = derive_key("wrong_password", &salt).unwrap();
        let plaintext = b"Sensitive Data";

        let ciphertext = encrypt(&key1, &nonce, plaintext, aad).unwrap();
        let result = decrypt(&key2, &nonce, &ciphertext, aad);

        assert!(matches!(result, Err(CryptoError::DecryptionFailed)));
    }

    #[test]
    fn test_flipped_ciphertext_byte_fails() {
        let salt = generate_salt().unwrap();
        let nonce = generate_nonce().unwrap();
        let aad = b"EVOR\x01";
        let key = derive_key("password", &salt).unwrap();

        let mut ciphertext = encrypt(&key, &nonce, b"Data", aad).unwrap();

        // Flip the first byte of the ciphertext (tampering)
        if !ciphertext.is_empty() {
            ciphertext[0] ^= 1;
        }

        let result = decrypt(&key, &nonce, &ciphertext, aad);
        assert!(matches!(result, Err(CryptoError::DecryptionFailed)));
    }

    #[test]
    fn test_flipped_header_aad_fails() {
        let salt = generate_salt().unwrap();
        let nonce = generate_nonce().unwrap();
        let key = derive_key("password", &salt).unwrap();
        let aad = b"EVOR\x01";

        let ciphertext = encrypt(&key, &nonce, b"Data", aad).unwrap();

        let bad_aad = b"EVOR\x02"; // Tampered header
        let result = decrypt(&key, &nonce, &ciphertext, bad_aad);

        assert!(matches!(result, Err(CryptoError::DecryptionFailed)));
    }

    #[test]
    fn test_same_password_different_salt_different_key() {
        let password = "my_password";
        let salt1 = generate_salt().unwrap();
        let mut salt2 = salt1;
        salt2[0] ^= 1; // Change 1 byte in salt

        let key1 = derive_key(password, &salt1).unwrap();
        let key2 = derive_key(password, &salt2).unwrap();

        // Keys must not be identical
        assert_ne!(key1.0, key2.0);
    }

    #[test]
    fn test_consecutive_randoms_are_unique() {
        let salt1 = generate_salt().unwrap();
        let salt2 = generate_salt().unwrap();
        assert_ne!(salt1, salt2, "Salts should be unique");

        let nonce1 = generate_nonce().unwrap();
        let nonce2 = generate_nonce().unwrap();
        assert_ne!(nonce1, nonce2, "Nonces should be unique");
    }
}
