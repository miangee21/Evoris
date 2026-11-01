//src/features/trash/components/empty-trash-button.tsx
import * as React from "react";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface EmptyTrashButtonProps {
  readonly trashCount: number;
  readonly disabled: boolean;
  readonly onClick: () => void;
}

export function EmptyTrashButton({
  trashCount,
  disabled,
  onClick,
}: EmptyTrashButtonProps): React.JSX.Element {
  const label =
    trashCount > 0
      ? `Empty trash (${String(trashCount)} items)`
      : "Empty trash";

  return (
    <Button
      type="button"
      variant="destructive"
      size="icon-lg"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <Trash2Icon className="size-4" />
    </Button>
  );
}
