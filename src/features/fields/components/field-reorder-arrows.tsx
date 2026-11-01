//src/features/fields/components/field-reorder-arrows.tsx
import * as React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

export interface FieldReorderArrowsProps {
  readonly index: number;
  readonly totalFields: number;
  readonly onMoveUp: () => void;
  readonly onMoveDown: () => void;
}

export function FieldReorderArrows({
  index,
  totalFields,
  onMoveUp,
  onMoveDown,
}: FieldReorderArrowsProps): React.JSX.Element {
  return (
    <>
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
        title="Move Up"
        aria-label="Move field up"
      >
        <ChevronUpIcon className="size-4" />
      </button>

      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === totalFields - 1}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
        title="Move Down"
        aria-label="Move field down"
      >
        <ChevronDownIcon className="size-4" />
      </button>
    </>
  );
}
