//src/features/settings/hooks/use-vault-settings.ts
import { useState } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { updateSettingsCmd } from "@/features/vault-session/api/vault.commands";
import { notifyError } from "@/shared/lib/errors";
import type { VaultConfig } from "@/shared/types/vault.types";

export interface UseVaultSettingsResult {
  navigationMode: "both" | "top-bar-only" | "dock-only";
  updateNavigationMode: (
    mode: "both" | "top-bar-only" | "dock-only",
  ) => Promise<void>;
  isSaving: boolean;
}

export function useVaultSettings(): UseVaultSettingsResult {
  const settings = useSessionStore((state) => state.settings);
  const [isSaving, setIsSaving] = useState(false);

  const updateNavigationMode = async (
    mode: "both" | "top-bar-only" | "dock-only",
  ): Promise<void> => {
    setIsSaving(true);

    const newSettings: VaultConfig = { ...settings, navigation_mode: mode };

    useSessionStore.setState(() => ({
      settings: newSettings,
    }));

    const result = await updateSettingsCmd(newSettings);

    if (!result.ok) {
      useSessionStore.setState(() => ({
        settings,
      }));
      notifyError(result.error);
    }

    setIsSaving(false);
  };

  return {
    navigationMode: settings.navigation_mode,
    updateNavigationMode,
    isSaving,
  };
}
