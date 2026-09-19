//src/features/theme/types/theme.types.ts
import type { ThemeMode } from "../constants/themes";
import type { AccentKey } from "../constants/accents";

export type { ThemeMode, AccentKey };

export interface ThemeState {
  readonly theme: ThemeMode;
  readonly accent: AccentKey;
}
