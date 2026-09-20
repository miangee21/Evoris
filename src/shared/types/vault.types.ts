//src/shared/types/vault.types.ts
export type FieldType =
  | "text"
  | "password"
  | "email"
  | "url"
  | "totp"
  | "notes"
  | "heading";

export interface Field {
  readonly id: string;
  readonly type: FieldType;
  readonly label: string;
  readonly value: string;
}

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly created_at: number;
  readonly updated_at: number;
}

export interface Item {
  readonly id: string;
  readonly category_id: string;
  readonly name: string;
  readonly fields: readonly Field[];
  readonly created_at: number;
  readonly updated_at: number;
  readonly is_favorite: boolean;
  readonly in_trash: boolean;
}

export interface VaultConfig {
  readonly lock_timeout_minutes: number;
}

export interface VaultData {
  readonly categories: readonly Category[];
  readonly items: readonly Item[];
}

export interface VaultState {
  readonly is_locked: boolean;
  readonly has_vault: boolean;
}
