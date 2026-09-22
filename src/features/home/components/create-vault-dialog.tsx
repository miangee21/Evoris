//src/features/home/components/create-vault-dialog.tsx
import { useState } from "react";
import { AlertTriangleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { PasswordChecklist } from "./password-checklist";
import { LoadingOverlay } from "@/shared/components/loading-overlay";
import { PasswordInput } from "@/shared/components/password-input";
import { useBlobCompanion } from "../hooks/use-blob-companion";
import { useCreateVault } from "../hooks/use-create-vault";
import { VaultMascotPanel } from "./vault-mascot-panel";
import { PasswordGeneratorModal } from "@/features/password-generator/components/password-generator-modal";
import { VAULT_NAME_MAX_LENGTH } from "@/shared/constants/limits";

interface CreateVaultDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function CreateVaultDialog({
  isOpen,
  onClose,
}: CreateVaultDialogProps): React.JSX.Element {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const {
    blobMood,
    setBlobMood,
    blobGaze,
    setBlobGaze,
    blobNod,
    setBlobNod,
    blobPositionX,
    setBlobPositionX,
    blobPositionY,
    setBlobPositionY,
    blobMouth,
    triggerTalk,
    resetBlob,
  } = useBlobCompanion();

  const {
    register,
    errors,
    masterPasswordValue,
    isProcessing,
    submitForm,
    resetForm,
    setValue,
  } = useCreateVault({ setBlobMood });

  const handleClose = (): void => {
    resetBlob();
    resetForm();
    onClose();
  };

  return (
    <>
      <LoadingOverlay
        isVisible={isProcessing}
        message="Encrypting and creating vault..."
      />
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          initialFocus={false}
          className="w-[min(90vw,52rem)] max-w-none max-h-[calc(100vh-3rem)] overflow-y-auto p-0 sm:max-w-none"
        >
          {/* Forced horizontal layout to prevent vertical stacking and cutoffs */}
          <div className="grid grid-cols-[200px_1fr] sm:grid-cols-[260px_1fr]">
            {/* Left Pane: Feral Mascot */}
            <VaultMascotPanel
              mood={blobMood}
              gaze={blobGaze}
              nod={blobNod}
              {...(blobMouth ? { mouth: blobMouth } : {})}
              positionX={blobPositionX}
              positionY={blobPositionY}
              onWake={() => {
                setBlobMood("surprised");
              }}
              caption={
                blobMood === "password"
                  ? "Your secret is safe..."
                  : "Let's secure your data."
              }
              captionHidden={blobPositionY >= 140}
            />

            {/* Right Pane: Creation Form */}
            <div className="p-6">
              <DialogHeader className="mb-4 gap-0">
                <DialogTitle className="text-2xl font-bold">
                  Create a Vault
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Set up a new secure offline vault.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={submitForm} className="space-y-3">
                {/* Vault Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">
                    Vault Name
                  </label>
                  <input
                    {...register("vaultName")}
                    autoComplete="off"
                    onFocus={() => {
                      setBlobMood("curious");
                      setBlobPositionX(85);
                      setBlobPositionY(-75);
                      setBlobGaze({ x: 18, y: -8, intensity: 1 });
                      setBlobNod(true);
                    }}
                    onBlur={() => {
                      setBlobMood("neutral");
                      setBlobPositionX(0);
                      setBlobPositionY(0);
                      setBlobGaze({ x: 0, y: 0, intensity: 0 });
                      setBlobNod(false);
                    }}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^A-Za-z0-9]/g,
                        "",
                      );
                      void register("vaultName").onChange(e);
                      if (e.target.value.length > 0) {
                        setBlobNod(true);
                        triggerTalk();
                      } else {
                        setBlobNod(false);
                      }
                    }}
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

                {/* Master Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">
                    Master Password
                  </label>
                  <PasswordInput
                    {...register("masterPassword")}
                    showCopy
                    showGenerator
                    copyValue={masterPasswordValue}
                    onGenerate={() => {
                      setIsGeneratorOpen(true);
                    }}
                    onFocus={() => {
                      setBlobMood("sideEye");
                      setBlobPositionX(-70);
                      setBlobPositionY(0);
                      setBlobGaze({ x: -18, y: -4, intensity: 1 });
                    }}
                    onBlur={() => {
                      setBlobMood("neutral");
                      setBlobPositionX(0);
                      setBlobPositionY(0);
                      setBlobGaze({ x: 0, y: 0, intensity: 0 });
                      setBlobNod(false);
                    }}
                    onChange={(e) => {
                      void register("masterPassword").onChange(e);
                      if (e.target.value.length > 0) {
                        setBlobMood("password");
                        setBlobNod(true);
                      } else {
                        setBlobMood("sideEye");
                        setBlobNod(false);
                      }
                    }}
                    placeholder="••••••••••••"
                  />
                  <PasswordChecklist value={masterPasswordValue} />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <PasswordInput
                    {...register("confirmPassword")}
                    // showCopy and showGenerator default to false here
                    onFocus={() => {
                      setBlobMood("sideEye");
                      setBlobPositionX(-70);
                      setBlobPositionY(140);
                      setBlobGaze({ x: -18, y: -4, intensity: 1 });
                    }}
                    onBlur={() => {
                      setBlobMood("neutral");
                      setBlobPositionX(0);
                      setBlobPositionY(0);
                      setBlobGaze({ x: 0, y: 0, intensity: 0 });
                      setBlobNod(false);
                    }}
                    onChange={(e) => {
                      void register("confirmPassword").onChange(e);
                      if (e.target.value.length > 0) {
                        setBlobMood("password");
                        setBlobNod(true);
                      } else {
                        setBlobMood("sideEye");
                        setBlobNod(false);
                      }
                    }}
                    placeholder="••••••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Warning Callout */}
                <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/10 p-3 text-warning-foreground">
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-warning" />
                  <p className="text-xs font-medium leading-relaxed">
                    If you forget your master password, your vault cannot be
                    recovered. Evoris operates strictly offline.
                  </p>
                </div>

                {/* Actions */}
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
                    Create Vault
                  </button>
                </div>
              </form>
            </div>
          </div>
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
          setValue("confirmPassword", generatedPassword, {
            shouldValidate: true,
          });
          setBlobMood("password");
          setBlobNod(true);
        }}
      />
    </>
  );
}
