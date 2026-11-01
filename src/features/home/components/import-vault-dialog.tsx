//src/features/home/components/import-vault-dialog.tsx
import { useState } from "react";
import { toast } from "sonner";
import { open } from "@tauri-apps/plugin-dialog";
import { documentDir } from "@tauri-apps/api/path";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LoadingOverlay } from "@/shared/components/loading-overlay";
import { notifyError } from "@/shared/lib/errors";
import { readImportFileCmd } from "@/features/export-import/hooks/use-import-vault-file";
import { ImportWizard } from "@/features/export-import/components/import-wizard";
import type { ImportSummary } from "@/features/export-import/types/export.types";

export const INVALID_EXPORT_MESSAGE = "This file is not a valid Evoris export.";

interface ImportVaultDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function ImportVaultDialog({
  isOpen,
  onClose,
}: ImportVaultDialogProps): React.JSX.Element {
  const [isReading, setIsReading] = useState(false);
  const [importPath, setImportPath] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  const resetState = (): void => {
    setImportPath(null);
    setSummary(null);
  };

  const handleClose = (): void => {
    resetState();
    onClose();
  };

  const handleChooseFile = async (): Promise<void> => {
    try {
      const docsPath = await documentDir();
      const selected = await open({
        multiple: false,
        defaultPath: docsPath,
        filters: [{ name: "Evoris Export", extensions: ["json"] }],
      });
      // File-dialog cancellation is silent.
      if (!selected || typeof selected !== "string") {
        handleClose();
        return;
      }
      setIsReading(true);
      const result = await readImportFileCmd(selected);
      if (result.ok) {
        setImportPath(selected);
        setSummary(result.value);
      } else if (result.error === "INVALID_IMPORT_FORMAT") {
        toast.error(INVALID_EXPORT_MESSAGE);
        handleClose();
      } else {
        notifyError(result.error);
        handleClose();
      }
    } catch {
      notifyError("UNKNOWN");
      handleClose();
    } finally {
      setIsReading(false);
    }
  };

  const isWizardOpen = importPath !== null && summary !== null;

  return (
    <>
      <LoadingOverlay isVisible={isReading} message="Reading export file..." />
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Import a vault
            </DialogTitle>
            <DialogDescription>
              Choose an Evoris export file (.json) to restore as a new vault.
              Only Evoris&apos;s own export format is accepted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isReading}
              onClick={() => {
                void handleChooseFile();
              }}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              Choose file
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isWizardOpen && (
        <ImportWizard
          isOpen
          onClose={handleClose}
          importPath={importPath}
          summary={summary}
        />
      )}
    </>
  );
}
