//src/features/settings/constants/settings-defaults.ts
import type { VaultConfig } from "@/shared/types/vault.types";

export const DEFAULT_SETTINGS: VaultConfig = {
  lock_timeout_minutes: 1,
  navigation_mode: "top-bar-only",
};
