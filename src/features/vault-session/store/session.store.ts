//src/features/vault-session/store/session.store.ts
import { create } from "zustand";
import type { SessionStore } from "../types/session.types";
import { DEFAULT_SETTINGS } from "@/features/settings/constants/settings-defaults";

const initialState = {
  status: "no-vault" as const,
  fileName: null,
  vaultName: null,
  items: [],
  categories: [],
  trash: [],
  settings: DEFAULT_SETTINGS,
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,

  setUnlocked: (fileName, vaultName, items, categories, settings): void => {
    set({
      status: "unlocked",
      fileName,
      vaultName,
      items: items.filter((i) => !i.in_trash),
      categories,
      trash: items.filter((i) => i.in_trash),
      settings,
    });
  },

  setLocked: (): void => {
    set(() => ({
      status: "locked",
      items: [],
      categories: [],
      trash: [],
      // fileName and vaultName survive so the unlock screen knows what to show
      settings: DEFAULT_SETTINGS,
    }));
  },

  setClosed: (): void => {
    set(initialState);
  },
}));
