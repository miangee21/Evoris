//src/features/settings/components/export-section.tsx
import { DownloadIcon, TriangleAlertIcon } from "lucide-react";
import { SettingsSection } from "./settings-section";
import { Button } from "@/shared/components/ui/button";

export interface ExportSectionProps {
  readonly onExport?: () => void | Promise<void>;
}

export function ExportSection({
  onExport,
}: ExportSectionProps): React.JSX.Element {
  return (
    <SettingsSection
      title="Export"
      description="Take a copy of your vault data out of Evoris."
      icon={<DownloadIcon className="size-5 text-primary" />}
      badge="Vault File"
    >
      <p className="text-xs text-muted-foreground leading-relaxed">
        The export contains your items, categories, and trash as a plain JSON
        file.
      </p>
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-border/50">
        <TriangleAlertIcon className="size-4 shrink-0 text-destructive" />
        <span className="text-[11px] text-muted-foreground">
          Warning: the exported JSON is NOT encrypted. Anyone with the file can
          read its contents, so store it somewhere safe.
        </span>
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          disabled={onExport === undefined}
          title={
            onExport === undefined
              ? "Export is not available yet — the export module has not provided its action."
              : undefined
          }
          onClick={(): void => {
            void onExport?.();
          }}
        >
          <DownloadIcon className="size-4" />
          Export vault as JSON
        </Button>
      </div>
    </SettingsSection>
  );
}
