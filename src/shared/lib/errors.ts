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

interface ErrorDetail {
  readonly title: string;
  readonly description: string;
}

const ERROR_MESSAGES: Record<EvorisError, ErrorDetail> = {
  INVALID_MASTER_PASSWORD: {
    title: "Access Denied",
    description: "The master password is incorrect. Please try again.",
  },
  FILE_NOT_FOUND: {
    title: "File Not Found",
    description: "The vault file could not be located.",
  },
  FILE_READ_FAILED: {
    title: "Read Error",
    description: "Failed to read the vault file from disk.",
  },
  FILE_WRITE_FAILED: {
    title: "Write Error",
    description: "Failed to write the vault file to disk.",
  },
  DECRYPTION_FAILED: {
    title: "Decryption Failed",
    description: "Failed to decrypt the vault. The file may be damaged.",
  },
  ENCRYPTION_FAILED: {
    title: "Encryption Failed",
    description: "Failed to securely encrypt the vault data.",
  },
  INVALID_IMPORT_FORMAT: {
    title: "Invalid Format",
    description: "This file is not a valid Evoris export.",
  },
  ITEM_NOT_FOUND: {
    title: "Item Missing",
    description: "The requested item was not found in the vault.",
  },
  CATEGORY_NOT_FOUND: {
    title: "Category Missing",
    description: "The requested category was not found.",
  },
  INVALID_TOTP_SECRET: {
    title: "Invalid TOTP",
    description: "The provided TOTP secret is invalid.",
  },
  // Rust mapping
  IO_ERROR: {
    title: "Storage Error",
    description: "Failed to read or write the vault file on disk.",
  },
  CRYPTO_ERROR: {
    title: "Cryptographic Error",
    description: "Incorrect master password or corrupted file encryption.",
  },
  PARSE_ERROR: {
    title: "Data Error",
    description: "Failed to parse the vault data structure.",
  },
  UNSUPPORTED_VERSION: {
    title: "Unsupported Version",
    description: "This vault was created with a newer version of Evoris.",
  },
  NOT_AN_EVORIS_FILE: {
    title: "Invalid File",
    description: "This file is not a valid Evoris vault.",
  },
  CORRUPTED_VAULT: {
    title: "Vault Corrupted",
    description: "The vault data is corrupted and cannot be read.",
  },
  VAULT_LOCKED: {
    title: "Vault Locked",
    description: "The vault is currently locked. Please unlock it first.",
  },
  UNKNOWN: {
    title: "Unexpected Error",
    description: "An unknown error occurred. Please try again.",
  },
};

export function getErrorDetail(error: string): ErrorDetail {
  if (error in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error as EvorisError];
  }
  return ERROR_MESSAGES.UNKNOWN;
}

export function notifyError(error: string, customTitle?: string): void {
  const detail = getErrorDetail(error);
  toast.error(customTitle ?? detail.title, {
    description: detail.description,
  });
}

export function notifySuccess(title: string, description?: string): void {
  toast.success(title, {
    description,
  });
}
