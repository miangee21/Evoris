//src/features/settings/components/settings-page.tsx
import { AppearanceSection } from "./appearance-section";
import { NavigationSection } from "./navigation-section";

export function SettingsPage(): React.JSX.Element {
  return (
    <div className="w-full h-[calc(100vh-var(--topbar-height,56px))] overflow-y-auto animate-in fade-in duration-slow ease-out">
      {/* Sticky Page Header Background  */}
      <div className="sticky top-0 bg-background pt-6 sm:pt-10 px-6 sm:px-10 pb-4 z-10">
        {/* Centered Text & Divider */}
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your vault preferences and application appearance.
          </p>
          <div className="h-px w-full bg-border mt-5" />
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full px-6 sm:px-10 pb-24">
        {/* Centered Sections */}
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-5 pt-1">
          {/* Global Appearance Settings (localStorage) */}
          <AppearanceSection />

          {/* Vault-Specific Settings (Rust) */}
          <NavigationSection />
        </div>
      </div>
    </div>
  );
}
