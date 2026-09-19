//src/features/theme/lib/apply-theme.ts
import type { ThemeMode, AccentKey } from "../types/theme.types";

let systemThemeMediaQuery: MediaQueryList | null = null;
let systemThemeListener: ((event: MediaQueryListEvent) => void) | null = null;

function handleSystemThemeChange(event: MediaQueryListEvent): void {
  const root = document.documentElement;
  if (event.matches) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;

  if (systemThemeMediaQuery && systemThemeListener) {
    systemThemeMediaQuery.removeEventListener("change", systemThemeListener);
    systemThemeMediaQuery = null;
    systemThemeListener = null;
  }

  if (theme === "system") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemThemeMediaQuery = mediaQuery;
    systemThemeListener = handleSystemThemeChange;

    if (mediaQuery.matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    mediaQuery.addEventListener("change", systemThemeListener);
  } else if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function applyAccent(accent: AccentKey): void {
  document.documentElement.dataset["accent"] = accent;
}
