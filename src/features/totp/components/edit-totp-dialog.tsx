//src/features/totp/components/edit-totp-dialog.tsx
import * as React from "react";
import { useConfirm } from "@/shared/hooks/use-confirm";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { isValidBase32, normalizeBase32 } from "../lib/base32";
import { totpSecretSchema } from "../schemas/totp.schema";
import { TotpSecretForm } from "./add-totp-dialog";

export interface EditTotpDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (secret: string) => void;
  readonly onRemove: () => void;
  readonly isProcessing?: boolean;
}

export function EditTotpDialog({
  open,
  onOpenChange,
  onConfirm,
  onRemove,
  isProcessing = false,
}: EditTotpDialogProps): React.JSX.Element {
  const [secret, setSecret] = React.useState("");
  const openConfirm = useConfirm();

  // Fresh, empty input every time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setSecret("");
    }
  }, [open]);

  const isValid = isValidBase32(secret);

  const handleConfirm = (): void => {
    const parsed = totpSecretSchema.safeParse(secret);
    if (!parsed.success) {
      return;
    }
    onConfirm(normalizeBase32(secret));
    onOpenChange(false);
  };

  const handleRemoveClick = (): void => {
    openConfirm({
      title: "Remove two-factor authentication?",
      description:
        "This item will no longer generate 2FA codes. Make sure 2FA is turned off for this account first, or you may be locked out.",
      confirmLabel: "Remove 2FA",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: (): void => {
        onRemove();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change two-factor authentication</DialogTitle>
          <DialogDescription>
            Paste the new secret key shown by the service. The old secret stops
            working as soon as you save.
          </DialogDescription>
        </DialogHeader>
        <TotpSecretForm
          secret={secret}
          onSecretChange={setSecret}
          disabled={isProcessing}
        />
        <div className="flex justify-start">
          <Button
            type="button"
            variant="destructive"
            disabled={isProcessing}
            onClick={handleRemoveClick}
          >
            Remove 2FA
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={(): void => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!isValid || isProcessing}
            onClick={handleConfirm}
          >
            {isProcessing ? "Saving…" : "Save new secret"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
