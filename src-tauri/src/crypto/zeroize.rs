//src-tauri/src/crypto/zeroize.rs
use zeroize::Zeroize;

/// Zeroizes the buffer memory and truncates it to 0 length.
pub fn scrub(buffer: &mut Vec<u8>) {
    buffer.zeroize();
    buffer.clear();
}
