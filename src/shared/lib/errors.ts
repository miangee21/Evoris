//src/shared/lib/errors.ts
import { toast } from "sonner";

export type EvorisError =
  | "INVALID_MASTER_PASSWORD"
  | "FILE_NOT_FOUND"
  | "FILE_READ_FAILED"
  | "FILE_WRITE_FAILED"
  | "NOT_AN_EVORIS_FILE"
  | "UNSUPPORTED_VAULT_VERSION"
  | "CORRUPTED_VAULT"
  | "DECRYPTION_FAILED"
  | "ENCRYPTION_FAILED"
  | "VAULT_LOCKED"
  | "INVALID_IMPORT_FORMAT"
  | "ITEM_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "INVALID_TOTP_SECRET"
  | "UNKNOWN";

const ERROR_MESSAGES: Record<EvorisError, string> = {
  INVALID_MASTER_PASSWORD: "The master password is incorrect.",
  FILE_NOT_FOUND: "The vault file could not be found.",
  FILE_READ_FAILED: "Failed to read the vault file from disk.",
  FILE_WRITE_FAILED: "Failed to write the vault file to disk.",
  NOT_AN_EVORIS_FILE: "This file is not a valid Evoris vault.",
  UNSUPPORTED_VAULT_VERSION:
    "This vault was created with a newer version of Evoris.",
  CORRUPTED_VAULT: "The vault data is corrupted and cannot be read.",
  DECRYPTION_FAILED: "Failed to decrypt the vault. The file may be damaged.",
  ENCRYPTION_FAILED: "Failed to encrypt the vault data.",
  VAULT_LOCKED: "The vault is currently locked.",
  INVALID_IMPORT_FORMAT: "This file is not a valid Evoris export.",
  ITEM_NOT_FOUND: "The requested item was not found.",
  CATEGORY_NOT_FOUND: "The requested category was not found.",
  INVALID_TOTP_SECRET: "The provided TOTP secret is invalid.",
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

export function notifySuccess(message: string): void {
  toast.success(message);
}
