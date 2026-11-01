//src/features/totp/lib/totp.ts
import {
  TOTP_ALGORITHM,
  TOTP_DIGITS,
  TOTP_PERIOD_SECONDS,
} from "../constants/totp-config";

function byteAt(bytes: Uint8Array, index: number): number {
  const value = bytes[index];
  if (value === undefined) {
    throw new Error("HMAC output is shorter than expected.");
  }
  return value;
}

/**
 * Generate the TOTP code for `secretBytes` at `timestampMs` (unix epoch
 * milliseconds, e.g. Date.now()).
 *
 * Counter = floor(timestampMs / 1000 / period), encoded as 8 big-endian
 * bytes, HMAC-SHA1, RFC 4226 dynamic truncation, modulo 10^digits, then
 * zero-padded to exactly `digits` characters.
 *
 * @throws Error when `secretBytes` is empty or WebCrypto is unavailable.
 */
export async function generateTotp(
  secretBytes: Uint8Array,
  timestampMs: number,
): Promise<string> {
  if (secretBytes.length === 0) {
    throw new Error("TOTP secret must not be empty.");
  }

  const counter = Math.floor(timestampMs / 1000 / TOTP_PERIOD_SECONDS);
  const counterBuffer = new ArrayBuffer(8);
  new DataView(counterBuffer).setBigUint64(0, BigInt(counter), false);

  const keyData = new Uint8Array(secretBytes);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: TOTP_ALGORITHM },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, counterBuffer);
  const hmac = new Uint8Array(signature);

  // RFC 4226 dynamic truncation: low nibble of the last byte is the offset.
  const offset = byteAt(hmac, hmac.length - 1) & 0x0f;
  const binary =
    ((byteAt(hmac, offset) & 0x7f) << 24) |
    (byteAt(hmac, offset + 1) << 16) |
    (byteAt(hmac, offset + 2) << 8) |
    byteAt(hmac, offset + 3);

  const modulus = 10 ** TOTP_DIGITS;
  return (binary % modulus).toString().padStart(TOTP_DIGITS, "0");
}

export function getSecondsRemaining(timestampMs: number): number {
  const elapsed = Math.floor(timestampMs / 1000) % TOTP_PERIOD_SECONDS;
  return TOTP_PERIOD_SECONDS - elapsed;
}

export function formatTotpCode(code: string): string {
  if (code.length !== TOTP_DIGITS) {
    return code;
  }
  const half = TOTP_DIGITS / 2;
  return `${code.slice(0, half)} ${code.slice(half)}`;
}
