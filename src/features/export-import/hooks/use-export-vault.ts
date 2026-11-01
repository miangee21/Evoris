//src/features/export-import/hooks/use-export-vault.ts
import { useState } from "react";
import { save } from "@tauri-apps/plugin-dialog";
import { documentDir } from "@tauri-apps/api/path";
import { z } from "zod";
import { invokeCommand } from "@/shared/lib/invoke";
import { useConfirmStore } from "@/shared/hooks/use-confirm";
import { notifyError, notifySuccess } from "@/shared/lib/errors";
import { useSessionStore } from "@/features/vault-session/store/session.store";

export const EXPORT_WARNING =
  "This file will not be encrypted. Anyone who opens it can read every password. Store it somewhere safe and delete it when you are done.";

export interface UseExportVaultResult {
  readonly isExporting: boolean;
  readonly exportVault: () => void;
}

function fileBaseName(path: string): string {
  const base = path.split(/[/\\]/).pop() ?? "";
  return base.replace(/\.evs$/i, "");
}

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${String(now.getFullYear())}-${month}-${day}`;
}

export function useExportVault(): UseExportVaultResult {
  const openConfirm = useConfirmStore((state) => state.openConfirm);
  const vaultName = useSessionStore((state) => state.vaultName);
  const fileName = useSessionStore((state) => state.fileName);
  const [isExporting, setIsExporting] = useState(false);

  const runExport = async (): Promise<void> => {
    try {
      setIsExporting(true);
      const name = vaultName ?? (fileName ? fileBaseName(fileName) : "Evoris");
      const docsPath = await documentDir();
      const defaultFileName = `${name}-export-${todayIsoDate()}.json`;
      const selectedPath = await save({
        defaultPath: `${docsPath}/${defaultFileName}`,
        filters: [{ name: "Evoris Export", extensions: ["json"] }],
      });
      // Save-dialog cancellation is silent.
      if (!selectedPath) {
        return;
      }
      const result = await invokeCommand(
        "export_vault_json",
        { path: selectedPath },
        z.null(),
      );
      if (!result.ok) {
        notifyError(result.error);
        return;
      }
      const savedFile = selectedPath.split(/[/\\]/).pop() ?? defaultFileName;
      notifySuccess("Vault exported", `Saved ${savedFile}.`);
    } catch {
      notifyError("UNKNOWN");
    } finally {
      setIsExporting(false);
    }
  };

  const exportVault = (): void => {
    openConfirm({
      title: "Export vault?",
      description: EXPORT_WARNING,
      confirmLabel: "Export",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: () => {
        void runExport();
      },
    });
  };

  return { isExporting, exportVault };
}
