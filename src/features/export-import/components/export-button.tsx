//src/features/export-import/components/export-button.tsx
import { DownloadIcon } from "lucide-react";
import { useExportVault } from "../hooks/use-export-vault";

interface ExportButtonProps {
  readonly className?: string;
}

export function ExportButton({
  className = "",
}: ExportButtonProps): React.JSX.Element {
  const { isExporting, exportVault } = useExportVault();

  return (
    <button
      type="button"
      disabled={isExporting}
      onClick={exportVault}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${className}`}
    >
      <DownloadIcon className="size-4" />
      {isExporting ? "Exporting…" : "Export vault"}
    </button>
  );
}
