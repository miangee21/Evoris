//src/features/settings/hooks/use-vault-settings.ts
import { useCallback, useState } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { updateSettingsCmd } from "@/features/vault-session/api/vault.commands";
import { AUTOLOCK_SECONDS_OPTIONS } from "@/shared/constants/limits";
import { notifyError } from "@/shared/lib/errors";
import type { VaultConfig } from "@/shared/types/vault.types";

export interface UseVaultSettingsResult {
  readonly navigationMode: "both" | "top-bar-only" | "dock-only";
  readonly autoLockEnabled: boolean;
  readonly lockTimeoutSeconds: number;
  readonly updateNavigationMode: (
    mode: "both" | "top-bar-only" | "dock-only",
  ) => Promise<void>;
  readonly updateAutolock: (
    enabled: boolean,
    timeoutSeconds?: number,
  ) => Promise<void>;
  readonly isSaving: boolean;
}

export function useVaultSettings(): UseVaultSettingsResult {
  const settings = useSessionStore((state) => state.settings);
  const [isSaving, setIsSaving] = useState(false);

  const persistSettings = useCallback(
    async (next: VaultConfig): Promise<void> => {
      const previous = useSessionStore.getState().settings;
      setIsSaving(true);

      useSessionStore.setState(() => ({
        settings: next,
      }));

      const result = await updateSettingsCmd(next);

      if (!result.ok) {
        useSessionStore.setState(() => ({
          settings: previous,
        }));
        notifyError(result.error);
      }

      setIsSaving(false);
    },
    [],
  );

  const updateNavigationMode = useCallback(
    async (mode: "both" | "top-bar-only" | "dock-only"): Promise<void> => {
      const current = useSessionStore.getState().settings;
      await persistSettings({ ...current, navigation_mode: mode });
    },
    [persistSettings],
  );

  const updateAutolock = useCallback(
    async (enabled: boolean, timeoutSeconds?: number): Promise<void> => {
      const current = useSessionStore.getState().settings;
      const timeout =
        timeoutSeconds !== undefined &&
        AUTOLOCK_SECONDS_OPTIONS.includes(timeoutSeconds)
          ? timeoutSeconds
          : current.lock_timeout_seconds;
      await persistSettings({
        ...current,
        auto_lock_enabled: enabled,
        lock_timeout_seconds: timeout,
      });
    },
    [persistSettings],
  );

  return {
    navigationMode: settings.navigation_mode,
    autoLockEnabled: settings.auto_lock_enabled,
    lockTimeoutSeconds: settings.lock_timeout_seconds,
    updateNavigationMode,
    updateAutolock,
    isSaving,
  };
}
