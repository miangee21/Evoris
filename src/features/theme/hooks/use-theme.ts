//src/features/theme/hooks/use-theme.ts
import { useEffect } from "react";
import { applyTheme } from "../lib/apply-theme";
import type { ThemeMode } from "../types/theme.types";

export function useTheme(theme: ThemeMode): void {
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
}
