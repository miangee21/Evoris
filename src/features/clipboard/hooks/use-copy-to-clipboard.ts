//src/features/clipboard/hooks/use-copy-to-clipboard.ts
import { useState, useCallback } from "react";
import { copyToClipboard, clearClipboard } from "../lib/clipboard";
import { CLIPBOARD_CLEAR_MS } from "@/shared/constants/limits";
import { notifySuccess, notifyError } from "@/shared/lib/errors";

// Global timer reference so it persists even if components unmount,
// ensuring the clipboard clears securely in the background.
let globalClearTimeout: ReturnType<typeof setTimeout> | null = null;
export interface UseCopyToClipboardResult {
  readonly isCopied: boolean;
  readonly copy: (value: string, silent?: boolean) => Promise<void>;
}

export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (value: string, silent = false) => {
    if (!value) return;

    try {
      await copyToClipboard(value);
      setIsCopied(true);

      if (!silent) {
        notifySuccess(
          "Copied to Clipboard",
          "Clipboard will automatically clear in 1 minute.",
        );
      }

      // Reset the global timer on every new copy
      if (globalClearTimeout) {
        clearTimeout(globalClearTimeout);
      }

      globalClearTimeout = setTimeout(() => {
        void clearClipboard();
        globalClearTimeout = null;
      }, CLIPBOARD_CLEAR_MS);

      // Local state reset for the UI checkmark icon (2 seconds)
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      notifyError("UNKNOWN");
    }
  }, []);

  return { isCopied, copy };
}

// Utility to explicitly wipe clipboard when the vault locks
export function forceClearClipboard(): void {
  if (globalClearTimeout) {
    clearTimeout(globalClearTimeout);
    globalClearTimeout = null;
  }
  void clearClipboard();
}
