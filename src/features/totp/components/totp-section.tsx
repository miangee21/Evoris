//src/features/totp/components/totp-section.tsx
import * as React from "react";
import { PlusIcon, ShieldCheckIcon } from "lucide-react";
import { useConfirm } from "@/shared/hooks/use-confirm";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { TotpConfig } from "@/shared/types/vault.types";
import { AddTotpDialog } from "./add-totp-dialog";
import { EditTotpDialog } from "./edit-totp-dialog";
import { TotpBadge } from "./totp-badge";

export interface TotpSectionProps {
  readonly totp: TotpConfig | null;
  readonly onTotpChange: (totp: TotpConfig | null) => void;
  readonly isProcessing?: boolean;
}

export function TotpSection({
  totp,
  onTotpChange,
  isProcessing = false,
}: TotpSectionProps): React.JSX.Element {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const openConfirm = useConfirm();

  const handleRemoveRequest = (): void => {
    openConfirm({
      title: "Remove two-factor authentication?",
      description:
        "This item will no longer generate 2FA codes. Make sure 2FA is turned off for this account first, or you may be locked out.",
      confirmLabel: "Remove 2FA",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: (): void => {
        onTotpChange(null);
      },
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-muted-foreground" />
            Two-factor authentication
          </CardTitle>
          <CardDescription>
            2FA codes belong to this item. They are separate from the custom
            fields below and are not stored as a field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totp === null ? (
            <Button
              type="button"
              variant="outline"
              disabled={isProcessing}
              onClick={(): void => {
                setIsAddOpen(true);
              }}
            >
              <PlusIcon className="size-4" />
              Add 2FA
            </Button>
          ) : (
            <TotpBadge
              secret={totp.secret}
              onChangeSecret={(): void => {
                setIsEditOpen(true);
              }}
              onRemove={handleRemoveRequest}
            />
          )}
        </CardContent>
      </Card>

      <AddTotpDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        isProcessing={isProcessing}
        onConfirm={(secret): void => {
          onTotpChange({ secret });
        }}
      />
      <EditTotpDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        isProcessing={isProcessing}
        onConfirm={(secret): void => {
          onTotpChange({ secret });
        }}
        onRemove={(): void => {
          onTotpChange(null);
        }}
      />
    </>
  );
}
