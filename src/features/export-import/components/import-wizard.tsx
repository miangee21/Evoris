//src/features/export-import/components/import-wizard.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { save } from "@tauri-apps/plugin-dialog";
import { documentDir } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LoadingOverlay } from "@/shared/components/loading-overlay";
import { PasswordInput } from "@/shared/components/password-input";
import { PasswordChecklist } from "@/features/home/components/password-checklist";
import { PasswordGeneratorModal } from "@/features/password-generator/components/password-generator-modal";
import {
  importVaultSchema,
  type ImportVaultFormValues,
} from "../schemas/import-vault.schema";
import { VAULT_FILE_EXTENSION } from "@/shared/constants/app.constants";
import { VAULT_NAME_MAX_LENGTH } from "@/shared/constants/limits";
import { ROUTE_PATHS } from "@/app/router/route-paths";
import { notifyError, notifySuccess } from "@/shared/lib/errors";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { createVaultFromImportCmd } from "../hooks/use-import-vault-file";
import type { ImportSummary } from "../types/export.types";

interface ImportWizardProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly importPath: string;
  readonly summary: ImportSummary;
}

export function ImportWizard({
  isOpen,
  onClose,
  importPath,
  summary,
}: ImportWizardProps): React.JSX.Element {
  const navigate = useNavigate();
  const setUnlocked = useSessionStore((state) => state.setUnlocked);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ImportVaultFormValues>({
    resolver: zodResolver(importVaultSchema),
    mode: "onChange",
  });

  const masterPasswordValue = watch("masterPassword", "");

  const handleClose = (): void => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ImportVaultFormValues): Promise<void> => {
    try {
      const docsPath = await documentDir();
      const destinationPath = await save({
        defaultPath: `${docsPath}/${data.vaultName}.${VAULT_FILE_EXTENSION}`,
        filters: [{ name: "Evoris Vault", extensions: [VAULT_FILE_EXTENSION] }],
      });
      // Save-dialog cancellation is silent; the wizard stays open.
      if (!destinationPath) {
        return;
      }
      setIsProcessing(true);
      const result = await createVaultFromImportCmd(
        destinationPath,
        importPath,
        data.vaultName,
        data.masterPassword,
      );
      if (result.ok) {
        setUnlocked(
          destinationPath,
          data.vaultName,
          [...result.value.items],
          [...result.value.categories],
          result.value.settings,
        );
        notifySuccess(
          "Vault imported",
          "Your vault was restored and is ready to use.",
        );
        handleClose();
        void navigate(ROUTE_PATHS.VAULT);
      } else {
        // Show the real code's message (e.g. INVALID_IMPORT_FORMAT),
        // never swallow it behind a generic UNKNOWN toast.
        notifyError(result.error);
      }
    } catch (error) {
      console.error("[Import Error]", error);
      notifyError(typeof error === "string" ? error : "UNKNOWN");
    } finally {
      setIsProcessing(false);
    }
  };

  const submitForm = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    void handleSubmit(onSubmit)(e);
  };

  return (
    <>
      <LoadingOverlay isVisible={isProcessing} message="Importing vault..." />
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[calc(100vh-3rem)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Import vault
            </DialogTitle>
            <DialogDescription>
              This export contains {summary.itemCount} items,{" "}
              {summary.categoryCount} categories, and {summary.trashCount} items
              in trash from “{summary.vaultName}”. Choose a new name and master
              password for the restored vault.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                New vault name
              </label>
              <input
                {...register("vaultName")}
                autoComplete="off"
                spellCheck={false}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="e.g. MyPasswords"
                maxLength={VAULT_NAME_MAX_LENGTH}
              />
              {errors.vaultName && (
                <p className="text-xs text-destructive">
                  {errors.vaultName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                New master password
              </label>
              <PasswordInput
                {...register("masterPassword")}
                spellCheck={false}
                autoComplete="off"
                placeholder="••••••••••••"
                showCopy
                showGenerator
                copyValue={masterPasswordValue}
                onGenerate={() => {
                  setIsGeneratorOpen(true);
                }}
              />
              <PasswordChecklist value={masterPasswordValue} />
              {errors.masterPassword && (
                <p className="text-xs text-destructive">
                  {errors.masterPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                Import vault
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PasswordGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => {
          setIsGeneratorOpen(false);
        }}
        onUsePassword={(generatedPassword) => {
          setValue("masterPassword", generatedPassword, {
            shouldValidate: true,
          });
        }}
      />
    </>
  );
}
