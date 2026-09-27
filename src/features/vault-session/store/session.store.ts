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

  // --- Category Mutators ---
  addCategory: (category): void => {
    set((state) => ({
      categories: [...state.categories, category],
    }));
  },

  updateCategory: (category): void => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? category : c,
      ),
    }));
  },

  deleteCategory: (id): void => {
    set((state) => ({
      // Remove category
      categories: state.categories.filter((c) => c.id !== id),
      // Frontend cascade nullify (matches Rust backend logic)
      items: state.items.map((item) =>
        item.category_id === id ? { ...item, category_id: null } : item,
      ),
      //Nullify category inside trash as well
      trash: state.trash.map((item) =>
        item.category_id === id ? { ...item, category_id: null } : item,
      ),
    }));
  },
}));
