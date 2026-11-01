//src/features/totp/components/add-totp-dialog.tsx
import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useTotpCode } from "../hooks/use-totp-code";
import { isValidBase32, normalizeBase32 } from "../lib/base32";
import { formatTotpCode } from "../lib/totp";
import { totpSecretSchema } from "../schemas/totp.schema";
import { TotpCountdownRing } from "./totp-countdown-ring";

export interface TotpSecretFormProps {
  readonly secret: string;
  readonly onSecretChange: (secret: string) => void;
  readonly disabled?: boolean;
}

export function TotpSecretForm({
  secret,
  onSecretChange,
  disabled = false,
}: TotpSecretFormProps): React.JSX.Element {
  const isEmpty = secret.trim() === "";
  const isValid = isValidBase32(secret);
  const preview = useTotpCode(isValid ? secret : null);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="totp-secret">Secret</Label>
      <Input
        id="totp-secret"
        type="text"
        value={secret}
        disabled={disabled}
        placeholder="Paste the Base32 secret from the service"
        spellCheck={false}
        autoComplete="off"
        aria-invalid={!isEmpty && !isValid}
        className="font-mono"
        onChange={(event): void => {
          onSecretChange(event.target.value);
        }}
      />
      {!isEmpty && !isValid ? (
        <p role="alert" className="text-sm text-destructive">
          Enter a valid Base32 secret (letters A-Z and digits 2-7).
        </p>
      ) : null}
      {isValid && preview.code !== "" ? (
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <TotpCountdownRing secondsRemaining={preview.secondsRemaining} />
          <div className="flex flex-col">
            <span className="font-mono text-base tracking-wider text-foreground">
              {formatTotpCode(preview.code)}
            </span>
            <span className="text-xs text-muted-foreground">
              Code preview — check it matches your authenticator app.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export interface AddTotpDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (secret: string) => void;
  readonly isProcessing?: boolean;
}

export function AddTotpDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing = false,
}: AddTotpDialogProps): React.JSX.Element {
  const [secret, setSecret] = React.useState("");

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add two-factor authentication</DialogTitle>
          <DialogDescription>
            Paste the secret key shown by the service when you set up 2FA. Codes
            stay on this item only.
          </DialogDescription>
        </DialogHeader>
        <TotpSecretForm
          secret={secret}
          onSecretChange={setSecret}
          disabled={isProcessing}
        />
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
            {isProcessing ? "Saving…" : "Add 2FA"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
