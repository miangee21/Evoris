//src-tauri/src/vault/format.rs
use crate::error::VaultError;

pub const MAGIC_BYTES: &[u8; 4] = b"EVOR";
pub const FORMAT_VERSION: u8 = 0x01;
pub const HEADER_LEN: usize = 33; // 4 (magic) + 1 (version) + 16 (salt) + 12 (nonce)

pub struct Container {
    pub magic: [u8; 4],
    pub version: u8,
    pub salt: [u8; 16],
    pub nonce: [u8; 12],
    pub ciphertext: Vec<u8>,
}

/// Builds the final .evs file byte array
#[must_use]
pub fn write_container(salt: &[u8; 16], nonce: &[u8; 12], ciphertext: &[u8]) -> Vec<u8> {
    let mut buffer = Vec::with_capacity(HEADER_LEN + ciphertext.len());
    buffer.extend_from_slice(MAGIC_BYTES);
    buffer.push(FORMAT_VERSION);
    buffer.extend_from_slice(salt);
    buffer.extend_from_slice(nonce);
    buffer.extend_from_slice(ciphertext);
    buffer
}

/// Parses raw bytes into a structural Container
///
/// # Errors
/// Returns `VaultError` if the file is too short, magic bytes don't match, or the version is unsupported.
pub fn parse_container(bytes: &[u8]) -> Result<Container, VaultError> {
    if bytes.len() < HEADER_LEN {
        return Err(VaultError::CorruptedVault("File too short".into()));
    }

    let mut magic = [0u8; 4];
    magic.copy_from_slice(&bytes[0..4]);
    if &magic != MAGIC_BYTES {
        return Err(VaultError::NotAnEvorisFile);
    }

    let version = bytes[4];
    if version != FORMAT_VERSION {
        return Err(VaultError::UnsupportedVaultVersion);
    }

    let mut salt = [0u8; 16];
    salt.copy_from_slice(&bytes[5..21]);

    let mut nonce = [0u8; 12];
    nonce.copy_from_slice(&bytes[21..33]);

    let ciphertext = bytes[33..].to_vec();

    Ok(Container {
        magic,
        version,
        salt,
        nonce,
        ciphertext,
    })
}

/// Extracts the exact 33-byte header to be used as AAD for AES-GCM
#[must_use]
pub fn header_bytes(container: &Container) -> Vec<u8> {
    let mut buffer = Vec::with_capacity(HEADER_LEN);
    buffer.extend_from_slice(&container.magic);
    buffer.push(container.version);
    buffer.extend_from_slice(&container.salt);
    buffer.extend_from_slice(&container.nonce);
    buffer
}
