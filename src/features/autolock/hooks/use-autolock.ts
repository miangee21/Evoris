//src/features/autolock/hooks/use-autolock.ts
import { useCallback, useEffect, useRef } from "react";
import { useIdleTimer } from "./use-idle-timer";
import { useLockVault } from "@/features/vault-session/hooks/use-lock-vault";
import { useSessionStore } from "@/features/vault-session/store/session.store";

export function useAutolock(): void {
  const autoLockEnabled = useSessionStore(
    (state) => state.settings.auto_lock_enabled,
  );
  const lockTimeoutSeconds = useSessionStore(
    (state) => state.settings.lock_timeout_seconds,
  );
  const status = useSessionStore((state) => state.status);
  const { lockVault } = useLockVault();

  const hasLockedRef = useRef(false);

  useEffect(() => {
    if (status === "unlocked") {
      hasLockedRef.current = false;
    }
  }, [status]);

  const handleIdle = useCallback((): void => {
    if (hasLockedRef.current) {
      return;
    }
    hasLockedRef.current = true;
    void lockVault();
  }, [lockVault]);

  useIdleTimer({
    enabled: autoLockEnabled && status === "unlocked",
    timeoutMs: lockTimeoutSeconds * 1000,
    onIdle: handleIdle,
  });
}
