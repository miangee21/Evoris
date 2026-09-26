//src/features/home/components/open-vault-dialog.tsx
import { useMemo } from "react";
import { LockKeyholeIcon } from "lucide-react";
import { LoadingOverlay } from "@/shared/components/loading-overlay";
import { PasswordInput } from "@/shared/components/password-input";
import { useBlobCompanion } from "../hooks/use-blob-companion";
import { useOpenVault } from "../hooks/use-open-vault";
import { VaultMascotPanel } from "./vault-mascot-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface OpenVaultDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedPath: string | null;
}

export function OpenVaultDialog({
  isOpen,
  onClose,
  selectedPath,
}: OpenVaultDialogProps): React.JSX.Element {
  // Extract filename securely for Windows and Mac/Linux paths
  const filename = useMemo(() => {
    if (!selectedPath) return "";
    return selectedPath.split(/[/\\]/).pop() ?? "Vault.evs";
  }, [selectedPath]);

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
    resetBlob,
  } = useBlobCompanion();

  const { register, errors, isProcessing, submitForm, resetForm } =
    useOpenVault({
      selectedPath,
      setBlobMood,
    });

  const handleClose = (): void => {
    resetBlob();
    resetForm();
    onClose();
  };

  return (
    <>
      <LoadingOverlay isVisible={isProcessing} message="Unlocking vault..." />

      <Dialog open={isOpen} onOpenChange={handleClose} disablePointerDismissal>
        <DialogContent
          initialFocus={false}
          className="w-[min(90vw,52rem)] p-0 sm:max-w-none max-h-[calc(100vh-3rem)] overflow-y-auto"
        >
          <div className="grid grid-cols-[200px_1fr] sm:grid-cols-[260px_1fr]">
            {/* Left Pane: Feral Mascot */}
            <VaultMascotPanel
              mood={blobMood}
              gaze={blobGaze}
              nod={blobNod}
              positionX={blobPositionX}
              positionY={blobPositionY + 28}
              onWake={() => {
                setBlobMood("surprised");
              }}
              caption={
                blobMood === "password"
                  ? "I'll keep it safe..."
                  : blobMood === "sad"
                    ? "Oops, try again!"
                    : "Ready to unlock."
              }
              captionHidden={false}
            />

            {/* Right Pane: Unlock Form */}
            <div className="p-6">
              <DialogHeader className="mb-6 gap-0">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <LockKeyholeIcon className="size-6 text-primary" />
                  Unlock Vault
                </DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Enter your master password to decrypt{" "}
                  <span className="font-semibold text-primary">{filename}</span>
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={submitForm}
                className="flex flex-col h-[calc(100%-4rem)] justify-between"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">
                    Master Password
                  </label>
                  <PasswordInput
                    {...register("masterPassword")}
                    onFocus={() => {
                      setBlobMood("sideEye");
                      setBlobPositionX(-70);
                      setBlobPositionY(0);
                      setBlobGaze({ x: -18, y: -4, intensity: 1 });
                    }}
                    onBlur={() => {
                      if (blobMood !== "sad") {
                        setBlobMood("neutral");
                        setBlobPositionX(0);
                        setBlobPositionY(0);
                        setBlobGaze({ x: 0, y: 0, intensity: 0 });
                        setBlobNod(false);
                      }
                    }}
                    onChange={(e) => {
                      void register("masterPassword").onChange(e);
                      if (e.target.value.length > 0) {
                        setBlobMood("password");
                        setBlobNod(true);
                        setBlobPositionX(-70);
                        setBlobGaze({ x: -18, y: -4, intensity: 1 });
                      } else {
                        setBlobMood("sideEye");
                        setBlobNod(false);
                      }
                    }}
                    placeholder="••••••••••••"
                  />
                  {errors.masterPassword && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.masterPassword.message}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 pb-2 mt-auto">
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
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
