//src/features/vault-session/components/unlock-screen.tsx
import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyholeIcon } from "lucide-react";
import { ROUTE_PATHS } from "@/app/router/route-paths";
import { LoadingOverlay } from "@/shared/components/loading-overlay";
import { PasswordInput } from "@/shared/components/password-input";
import { useBlobCompanion } from "@/features/home/hooks/use-blob-companion";
import { VaultMascotPanel } from "@/features/home/components/vault-mascot-panel";
import { useUnlockVault } from "../hooks/use-unlock-vault";

export function UnlockScreen(): React.JSX.Element {
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
  } = useBlobCompanion();

  const {
    register,
    errors,
    isProcessing,
    submitForm,
    handleCloseVault,
    fileName,
    vaultName,
  } = useUnlockVault({ setBlobMood });

  // Extract friendly filename safely
  const displayFileName = useMemo(() => {
    if (!fileName) return "";
    return fileName.split(/[/\\]/).pop() ?? "Vault.evs";
  }, [fileName]);

  // CRUCIAL: Empty State Redirect
  if (!fileName) {
    return <Navigate to={ROUTE_PATHS.HOME} replace />;
  }

  return (
    <>
      <LoadingOverlay isVisible={isProcessing} message="Unlocking vault..." />

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-8 bg-background">
        {/* Home Doodle Background Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-accent-base opacity-30 transition-opacity duration-normal dark:opacity-[0.06] mask-[url('/home-doodle.svg')] mask-center mask-no-repeat mask-cover [-webkit-mask-image:url('/home-doodle.svg')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:cover]"
        />
        <div className="relative z-10 w-full max-w-[min(90vw,52rem)] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg">
          <div className="grid min-h-70 grid-cols-[200px_1fr] sm:grid-cols-[260px_1fr]">
            {/* Left Pane: Feral Mascot */}
            <div className="flex h-full w-full flex-col overflow-hidden border-r border-border/50 bg-muted/30">
              <div className="flex-1 w-full">
                <VaultMascotPanel
                  mood={blobMood}
                  gaze={blobGaze}
                  nod={blobNod}
                  positionX={blobPositionX}
                  positionY={blobPositionY + 28}
                  onWake={(): void => {
                    setBlobMood("surprised");
                  }}
                  caption={
                    blobMood === "password"
                      ? "I'll keep it safe..."
                      : blobMood === "sad"
                        ? "Oops, try again!"
                        : "Welcome back."
                  }
                  captionHidden={false}
                />
              </div>
            </div>

            {/* Right Pane: Unlock Form */}
            <div className="flex flex-col p-6 sm:p-8">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <LockKeyholeIcon className="size-7 text-primary" />
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {vaultName ?? "Unlock Vault"}
                  </h1>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {displayFileName}
                </p>
              </div>

              <form
                onSubmit={(e): void => {
                  void submitForm(e);
                }}
                className="flex flex-1 flex-col justify-between"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Master Password
                  </label>
                  <PasswordInput
                    {...register("masterPassword")}
                    autoFocus
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
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleCloseVault}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  >
                    Close vault
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-colors"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
