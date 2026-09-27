//src/features/settings/components/settings-page.tsx
import { AppearanceSection } from "./appearance-section";
import { NavigationSection } from "./navigation-section";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";

export function SettingsPage(): React.JSX.Element {
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
        </div>
      </div>
    </PageContainer>
  );
}
