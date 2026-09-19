//src/features/theme/hooks/use-accent.ts
import { useEffect } from "react";
import { applyAccent } from "../lib/apply-theme";
import type { AccentKey } from "../types/theme.types";

export function useAccent(accent: AccentKey): void {
  useEffect(() => {
    applyAccent(accent);
  }, [accent]);
}
