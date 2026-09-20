//src/features/vault-session/types/session.types.ts
import type {
  Item as VaultItem,
  Category as VaultCategory,
  VaultConfig as VaultSettings,
} from "@/shared/types/vault.types";

export interface SessionState {
  status: "no-vault" | "locked" | "unlocked";
  fileName: string | null;
  vaultName: string | null;
  items: readonly VaultItem[];
  categories: readonly VaultCategory[];
  trash: readonly VaultItem[]; // Using VaultItem since in_trash boolean handles the state
  settings: VaultSettings;
}

export interface SessionActions {
  setUnlocked: (
    fileName: string,
    vaultName: string,
    items: VaultItem[],
    categories: VaultCategory[],
    settings: VaultSettings,
  ) => void;
  setLocked: () => void;
  setClosed: () => void;
}

export type SessionStore = SessionState & SessionActions;
