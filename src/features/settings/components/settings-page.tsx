//src/features/settings/components/settings-page.tsx
import { AppearanceSection } from "./appearance-section";
import { NavigationSection } from "./navigation-section";
import { VaultSection } from "./vault-section";
import { ExportSection } from "./export-section";
import { AboutSection } from "./about-section";
import { PageContainer } from "@/shared/components/page-container";
import { useExportVault } from "@/features/export-import/hooks/use-export-vault";
import { PageHeader } from "@/shared/components/page-header";

export function SettingsPage(): React.JSX.Element {
  const { exportVault } = useExportVault();

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your vault preferences and application appearance."
      />

      <div className="w-full px-6 pb-24 sm:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pt-2">
          {/* Global Appearance Settings (localStorage) */}
          <AppearanceSection />

          {/* Vault-Specific Settings (Rust) */}
          <NavigationSection />

          {/* Vault Security (Rust) */}
          <VaultSection />

          <ExportSection onExport={exportVault} />

          {/* Application Information */}
          <AboutSection />
        </div>
      </div>
    </PageContainer>
  );
}
