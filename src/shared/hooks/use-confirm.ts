//src/shared/hooks/use-confirm.ts
import { useState, useCallback } from "react";

export interface ConfirmState {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description: string;
}

export interface UseConfirmReturn {
  readonly confirmState: ConfirmState;
  readonly confirm: (title: string, description: string) => Promise<boolean>;
  readonly handleConfirm: () => void;
  readonly handleCancel: () => void;
}

export function useConfirm(): UseConfirmReturn {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const [resolveFn, setResolveFn] = useState<((value: boolean) => void) | null>(
    null,
  );

  const confirm = useCallback(
    (title: string, description: string): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({ isOpen: true, title, description });
        setResolveFn(() => resolve);
      });
    },
    [],
  );

  const handleConfirm = useCallback((): void => {
    if (resolveFn) {
      resolveFn(true);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [resolveFn]);

  const handleCancel = useCallback((): void => {
    if (resolveFn) {
      resolveFn(false);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [resolveFn]);

  return { confirmState, confirm, handleConfirm, handleCancel };
}
