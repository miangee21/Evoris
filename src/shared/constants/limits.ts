//src/shared/constants/limits.ts
export const MASTER_PASSWORD_MIN_LENGTH = 15;
export const MASTER_PASSWORD_MAX_LENGTH = 64;
export const VAULT_NAME_MAX_LENGTH = 40;
export const CATEGORY_NAME_MAX_LENGTH = 40;
export const ITEM_NAME_MIN_LENGTH = 3;
export const ITEM_NAME_MAX_LENGTH = 64;
export const FIELD_LABEL_MAX_LENGTH = 90;
export const GENERATOR_MIN_LENGTH = 8;
export const GENERATOR_MAX_LENGTH = 64;
export const GENERATOR_DEFAULT_LENGTH = 20;
export const CLIPBOARD_CLEAR_MS = 60_000;
export const SEARCH_DEBOUNCE_MS = 200;
export const ATTACHMENT_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const ATTACHMENT_MAX_COUNT = 10;
export const TOTP_DIGITS = 6;
export const TOTP_PERIOD_SECONDS = 30;
export const AUTOLOCK_SECONDS_OPTIONS: readonly number[] = [
  10, 15, 20, 30, 60, 180, 300,
];
export const DEFAULT_AUTOLOCK_SECONDS = 30;
