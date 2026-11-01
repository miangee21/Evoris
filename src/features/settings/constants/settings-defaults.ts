//src/features/settings/constants/settings-defaults.ts
import type { VaultConfig } from "@/shared/types/vault.types";
import { DEFAULT_AUTOLOCK_SECONDS } from "@/shared/constants/limits";

export const DEFAULT_SETTINGS: VaultConfig = {
  navigation_mode: "top-bar-only",
  auto_lock_enabled: true,
  lock_timeout_seconds: DEFAULT_AUTOLOCK_SECONDS,
};
