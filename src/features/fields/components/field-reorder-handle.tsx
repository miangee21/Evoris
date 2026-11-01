//src/features/fields/components/field-reorder-handle.tsx
import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

export interface FieldReorderHandleProps {
  readonly attributes?: DraggableAttributes | undefined;
  readonly listeners?: DraggableSyntheticListeners | undefined;
}

export function FieldReorderHandle({
  attributes,
  listeners,
}: FieldReorderHandleProps): React.JSX.Element {
  return (
    <button
      type="button"
      {...(attributes ?? {})}
      {...(listeners ?? {})}
      className="cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
      title="Drag to reorder"
      aria-label="Drag to reorder field"
    >
      <GripVerticalIcon className="size-4" />
    </button>
  );
}
