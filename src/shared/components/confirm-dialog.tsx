//src/shared/components/confirm-dialog.tsx
import { useConfirmStore } from "../hooks/use-confirm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

export function ConfirmDialog(): React.JSX.Element {
  const {
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel,
    variant,
    onConfirm,
    closeConfirm,
  } = useConfirmStore();

  const handleConfirmClick = (): void => {
    if (onConfirm) {
      const result = onConfirm();
      if (result instanceof Promise) {
        result
          .finally(() => {
            closeConfirm();
          })
          .catch(console.error);
        return;
      }
    }
    closeConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeConfirm}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmClick}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
