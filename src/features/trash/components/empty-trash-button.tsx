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
  return (
    <Button
      type="button"
      variant="destructive"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        trashCount > 0
          ? `Empty trash (${String(trashCount)} items)`
          : "Empty trash"
      }
    >
      <Trash2Icon className="size-4" />
      Empty Trash
    </Button>
  );
}
