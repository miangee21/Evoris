//src/features/settings/components/vault-section.tsx
import { VaultIcon } from "lucide-react";
import { SettingsSection } from "./settings-section";
import { ChangeMasterPasswordForm } from "./change-master-password-form";
import { AutolockSelector } from "./autolock-selector";

export function VaultSection(): React.JSX.Element {
  return (
    <SettingsSection
      title="Vault"
      description="Change your master password and control automatic locking."
      icon={<VaultIcon className="size-5 text-primary" />}
      badge="Vault File"
    >
      <ChangeMasterPasswordForm />

      <div className="border-t border-border/50 pt-4">
        <AutolockSelector />
      </div>
    </SettingsSection>
  );
}
