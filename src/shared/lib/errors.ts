//src/shared/lib/errors.ts
import { toast } from "sonner";

export type EvorisError =
  // Frontend-specific errors
  | "INVALID_MASTER_PASSWORD"
  | "FILE_NOT_FOUND"
  | "FILE_READ_FAILED"
  | "FILE_WRITE_FAILED"
  | "DECRYPTION_FAILED"
  | "ENCRYPTION_FAILED"
  | "INVALID_IMPORT_FORMAT"
  | "ITEM_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "INVALID_TOTP_SECRET"
  // Rust Backend error codes (from VaultError)
  | "IO_ERROR"
  | "CRYPTO_ERROR"
  | "PARSE_ERROR"
  | "UNSUPPORTED_VERSION"
  | "NOT_AN_EVORIS_FILE"
  | "CORRUPTED_VAULT"
  | "VAULT_LOCKED"
  | "UNKNOWN";

const ERROR_MESSAGES: Record<EvorisError, string> = {
  INVALID_MASTER_PASSWORD: "The master password is incorrect.",
  FILE_NOT_FOUND: "The vault file could not be found.",
  FILE_READ_FAILED: "Failed to read the vault file from disk.",
  FILE_WRITE_FAILED: "Failed to write the vault file to disk.",
  DECRYPTION_FAILED: "Failed to decrypt the vault. The file may be damaged.",
  ENCRYPTION_FAILED: "Failed to encrypt the vault data.",
  INVALID_IMPORT_FORMAT: "This file is not a valid Evoris export.",
  ITEM_NOT_FOUND: "The requested item was not found.",
  CATEGORY_NOT_FOUND: "The requested category was not found.",
  INVALID_TOTP_SECRET: "The provided TOTP secret is invalid.",
  // Rust mapping
  IO_ERROR: "Failed to read or write the vault file on disk.",
  CRYPTO_ERROR: "Incorrect master password or corrupted file encryption.",
  PARSE_ERROR: "Failed to parse the vault data structure.",
  UNSUPPORTED_VERSION: "This vault was created with a newer version of Evoris.",
  NOT_AN_EVORIS_FILE: "This file is not a valid Evoris vault.",
  CORRUPTED_VAULT: "The vault data is corrupted and cannot be read.",
  VAULT_LOCKED: "The vault is currently locked.",
  UNKNOWN: "An unknown error occurred.",
};

export function getErrorMessage(error: string): string {
  if (error in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error as EvorisError];
  }
  return ERROR_MESSAGES.UNKNOWN;
}

export function notifyError(error: string): void {
  toast.error(getErrorMessage(error));
}

export function notifySuccess(title: string, description?: string): void {
  toast.success(title, {
    description,
  });
}
