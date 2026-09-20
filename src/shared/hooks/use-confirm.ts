//src/shared/hooks/use-confirm.ts
import { create } from "zustand";

export interface ConfirmDialogState {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly variant: "default" | "destructive";
  readonly onConfirm?: (() => void | Promise<void>) | undefined;
}

export interface ConfirmDialogActions {
  readonly openConfirm: (options: Omit<ConfirmDialogState, "isOpen">) => void;
  readonly closeConfirm: () => void;
}

export type ConfirmDialogStore = ConfirmDialogState & ConfirmDialogActions;

export const useConfirmStore = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  variant: "default",
  onConfirm: undefined,
  openConfirm: (options): void => {
    set({ ...options, isOpen: true });
  },
  closeConfirm: (): void => {
    set({ isOpen: false });
  },
}));

export function useConfirm(): (
  options: Omit<ConfirmDialogState, "isOpen">,
) => void {
  return useConfirmStore((state) => state.openConfirm);
}
