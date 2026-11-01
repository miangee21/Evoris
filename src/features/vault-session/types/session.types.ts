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
  trash: readonly VaultItem[];
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
  // --- Category Mutators ---
  addCategory: (category: VaultCategory) => void;
  updateCategory: (category: VaultCategory) => void;
  deleteCategory: (id: string) => void;
  // --- Item Mutators ---
  addItem: (item: VaultItem) => void;
  updateItem: (item: VaultItem) => void;
  deleteItem: (id: string, deletedItem?: VaultItem) => void;
  // --- Trash Mutators ---
  restoreItem: (item: VaultItem) => void;
  deleteItemPermanently: (id: string) => void;
  emptyTrash: () => void;
}

export type SessionStore = SessionState & SessionActions;
