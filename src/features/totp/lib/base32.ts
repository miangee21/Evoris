//src/features/totp/lib/base32.ts
import { err, ok, type Result } from "@/shared/lib/result";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const BASE32_VALUES: ReadonlyMap<string, number> = new Map(
  Array.from(BASE32_ALPHABET).map((char, index) => [char, index] as const),
);

export function normalizeBase32(value: string): string {
  return value.toUpperCase().replace(/\s+/gu, "").replace(/=+$/u, "");
}

export function decodeBase32(value: string): Result<Uint8Array, string> {
  const stripped = value.toUpperCase().replace(/\s+/gu, "");

  if (stripped.length === 0) {
    return err("Secret must not be empty.");
  }
  if (!/^[A-Z2-7]+=*$/u.test(stripped)) {
    return err("Secret must only contain Base32 characters (A-Z, 2-7).");
  }

  const normalized = normalizeBase32(value);
  const remainder = normalized.length % 8;
  if (remainder === 1 || remainder === 3 || remainder === 6) {
    return err("Secret has an invalid Base32 length.");
  }

  const bytes: number[] = [];
  let buffer = 0;
  let bitsInBuffer = 0;
  for (const char of normalized) {
    const charValue = BASE32_VALUES.get(char);
    if (charValue === undefined) {
      return err("Secret must only contain Base32 characters (A-Z, 2-7).");
    }
    buffer = (buffer << 5) | charValue;
    bitsInBuffer += 5;
    if (bitsInBuffer >= 8) {
      bitsInBuffer -= 8;
      bytes.push((buffer >> bitsInBuffer) & 0xff);
    }
  }
  return ok(new Uint8Array(bytes));
}

export function isValidBase32(value: string): boolean {
  const result = decodeBase32(value);
  return result.ok && result.value.length > 0;
}
