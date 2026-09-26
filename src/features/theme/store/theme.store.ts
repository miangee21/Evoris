//src/features/theme/store/theme.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type AccentColor =
  | "violet"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan";

interface ThemeState {
  readonly theme: ThemeMode;
  readonly accent: AccentColor;
  readonly isPullCordEnabled: boolean;
  readonly setTheme: (theme: ThemeMode) => void;
  readonly setAccent: (accent: AccentColor) => void;
  readonly togglePullCord: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      accent: "violet",
      isPullCordEnabled: false, // Default OFF
      setTheme: (theme): void => {
        set({ theme });
      },
      setAccent: (accent): void => {
        set({ accent });
      },
      togglePullCord: (): void => {
        set((state) => ({ isPullCordEnabled: !state.isPullCordEnabled }));
      },
    }),
    {
      name: "evoris-theme-storage",
    },
  ),
);
