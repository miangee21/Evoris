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
  readonly masked: boolean;
  readonly order: number;
}

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface TotpConfig {
  readonly secret: string;
}

export interface Item {
  readonly id: string;
  readonly category_id: string | null;
  readonly name: string;
  readonly fields: readonly Field[];
  readonly totp: TotpConfig | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly is_favorite: boolean;
  readonly in_trash: boolean;
}

export interface VaultConfig {
  readonly lock_timeout_minutes: number;
  readonly navigation_mode: "both" | "top-bar-only" | "dock-only";
}

export interface VaultData {
  readonly version: number;
  readonly settings: VaultConfig;
  readonly categories: readonly Category[];
  readonly items: readonly Item[];
  readonly created_at: string;
  readonly updated_at: string;
}
