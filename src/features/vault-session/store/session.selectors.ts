//src/features/vault-session/store/session.selectors.ts
import type { SessionState } from "../types/session.types";
import type { Item, Category, VaultConfig } from "@/shared/types/vault.types";

export const selectIsUnlocked = (state: SessionState): boolean =>
  state.status === "unlocked";
export const selectIsLocked = (state: SessionState): boolean =>
  state.status === "locked";
export const selectVaultInfo = (
  state: SessionState,
): { fileName: string | null; vaultName: string | null } => ({
  fileName: state.fileName,
  vaultName: state.vaultName,
});
export const selectItems = (state: SessionState): readonly Item[] =>
  state.items;
export const selectCategories = (state: SessionState): readonly Category[] =>
  state.categories;
export const selectTrash = (state: SessionState): readonly Item[] =>
  state.trash;
export const selectSettings = (state: SessionState): VaultConfig =>
  state.settings;
