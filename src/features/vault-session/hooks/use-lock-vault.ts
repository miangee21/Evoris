//src/features/vault-session/hooks/use-lock-vault.ts
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../store/session.store";
import { lockVaultCmd } from "../api/vault.commands";
import { forceClearClipboard } from "@/features/clipboard/hooks/use-copy-to-clipboard";
import { ROUTE_PATHS } from "@/app/router/route-paths";
import { notifyError } from "@/shared/lib/errors";

export interface UseLockVaultResult {
  readonly lockVault: () => Promise<void>;
  readonly isLocking: boolean;
}

export function useLockVault(): UseLockVaultResult {
  const navigate = useNavigate();
  const setLocked = useSessionStore((state) => state.setLocked);
  const [isLocking, setIsLocking] = useState(false);

  const lockVault = useCallback(async (): Promise<void> => {
    try {
      setIsLocking(true);

      // 1. Wipe backend memory (Zeroize keys in Rust)
      const result = await lockVaultCmd();

      if (!result.ok) {
        notifyError(result.error);
        return;
      }

      // 2. Wipe sensitive clipboard data
      forceClearClipboard();

      // 3. Clear frontend items/categories (keeping path for unlock screen)
      setLocked();

      // 4. Force navigation to unlock screen (replace history so user can't hit back)
      void navigate(ROUTE_PATHS.UNLOCK, { replace: true });
    } catch (err) {
      console.error("Failed to lock vault:", err);
      notifyError("UNKNOWN");
    } finally {
      setIsLocking(false);
    }
  }, [navigate, setLocked]);

  return { lockVault, isLocking };
}
