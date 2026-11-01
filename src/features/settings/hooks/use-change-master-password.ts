//src/features/settings/hooks/use-change-master-password.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { z } from "zod";
import { invokeCommand } from "@/shared/lib/invoke";
import { notifyError, notifySuccess } from "@/shared/lib/errors";

export interface MasterPasswordProgress {
  readonly stage: string;
  readonly percent: number;
}

export type ChangeMasterPasswordOutcome =
  | "success"
  | "wrong-password"
  | "failed";

export interface UseChangeMasterPasswordResult {
  readonly isChanging: boolean;
  readonly isProgressOpen: boolean;
  readonly progress: MasterPasswordProgress;
  readonly changeMasterPassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<ChangeMasterPasswordOutcome>;
  readonly closeProgress: () => void;
}

interface ProgressPayload {
  readonly stage: string;
  readonly percent: number;
}

function clampPercent(percent: number): number {
  if (Number.isNaN(percent)) return 0;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export function useChangeMasterPassword(): UseChangeMasterPasswordResult {
  const [isChanging, setIsChanging] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progress, setProgress] = useState<MasterPasswordProgress>({
    stage: "starting",
    percent: 0,
  });
  const unlistenRef = useRef<UnlistenFn | null>(null);
  const isChangingRef = useRef(false);

  useEffect(() => {
    return (): void => {
      unlistenRef.current?.();
      unlistenRef.current = null;
    };
  }, []);

  const changeMasterPassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
    ): Promise<ChangeMasterPasswordOutcome> => {
      isChangingRef.current = true;
      setIsChanging(true);
      setIsProgressOpen(true);
      setProgress({ stage: "starting", percent: 0 });

      try {
        try {
          const unlisten = await listen<ProgressPayload>(
            "master-password-progress",
            (event) => {
              setProgress({
                stage: event.payload.stage,
                percent: clampPercent(event.payload.percent),
              });
            },
          );
          unlistenRef.current = unlisten;
        } catch {
          // Progress events are best-effort; the command still runs and
          // its outcome below is authoritative.
          unlistenRef.current = null;
        }

        const result = await invokeCommand(
          "change_master_password",
          { oldPassword: currentPassword, newPassword },
          z.null(),
        );

        if (!result.ok) {
          if (result.error === "INVALID_MASTER_PASSWORD") {
            notifyError("INVALID_MASTER_PASSWORD");
            return "wrong-password";
          }
          notifyError(result.error);
          return "failed";
        }

        setProgress({ stage: "done", percent: 100 });
        notifySuccess(
          "Master password changed",
          "Your session continues with the new password — no need to sign in again.",
        );
        return "success";
      } catch (error) {
        console.error("Failed to change master password:", error);
        notifyError("UNKNOWN");
        return "failed";
      } finally {
        unlistenRef.current?.();
        unlistenRef.current = null;
        isChangingRef.current = false;
        setIsChanging(false);
      }
    },
    [],
  );

  const closeProgress = useCallback((): void => {
    // Never allow the dialog to be dismissed while the change is running.
    if (!isChangingRef.current) {
      setIsProgressOpen(false);
    }
  }, []);

  return {
    isChanging,
    isProgressOpen,
    progress,
    changeMasterPassword,
    closeProgress,
  };
}
