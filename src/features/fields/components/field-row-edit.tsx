//src/features/fields/components/field-row-edit.tsx
import * as React from "react";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";
import {
  GripVerticalIcon,
  Trash2Icon,
  ShieldIcon,
  ShieldAlertIcon,
} from "lucide-react";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { FIELD_TYPES } from "../constants/field-types";
import { rendererFor } from "./field-renderer-select";
import { FieldReorderHandle } from "./field-reorder-handle";
import { FieldReorderArrows } from "./field-reorder-arrows";
import { Input } from "@/shared/components/ui/input";
import type { FieldValues } from "../schemas/field.schema";
import { fieldPath } from "../lib/field-path";
import type { ItemFormValues } from "@/features/items/schemas/item.schema";

export interface FieldRowEditProps {
  readonly field: FieldValues;
  readonly index: number;
  readonly totalFields: number;
  readonly control: Control<ItemFormValues>;
  readonly dragHandleAttributes?: DraggableAttributes | undefined;
  readonly dragHandleListeners?: DraggableSyntheticListeners | undefined;
  readonly onDelete: (id: string) => void;
  readonly onMoveUp: (id: string) => void;
  readonly onMoveDown: (id: string) => void;
  readonly onGeneratePassword?: (() => void) | undefined;
}

export function FieldRowEdit({
  field,
  index,
  totalFields,
  control,
  dragHandleAttributes,
  dragHandleListeners,
  onDelete,
  onMoveUp,
  onMoveDown,
  onGeneratePassword,
}: FieldRowEditProps): React.JSX.Element {
  const labelController = useController({
    control,
    name: fieldPath(index, "label"),
  });
  const valueController = useController({
    control,
    name: fieldPath(index, "value"),
  });
  const maskedController = useController({
    control,
    name: fieldPath(index, "masked"),
  });

  const fieldTypeConfig = FIELD_TYPES.find((t) => t.key === field.type);
  const IconComponent = fieldTypeConfig?.icon ?? GripVerticalIcon;
  const RendererComponent = rendererFor(field.type);
  const isMasked = maskedController.field.value;

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/20">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FieldReorderHandle
            attributes={dragHandleAttributes}
            listeners={dragHandleListeners}
          />
          <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
            <IconComponent className="size-3.5" />
            <span className="uppercase">{fieldTypeConfig?.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <FieldReorderArrows
            index={index}
            totalFields={totalFields}
            onMoveUp={(): void => {
              onMoveUp(field.id);
            }}
            onMoveDown={(): void => {
              onMoveDown(field.id);
            }}
          />
          <div className="mx-1 h-4 w-px bg-border" />
          {fieldTypeConfig?.supportsMask && (
            <button
              type="button"
              onClick={(): void => {
                maskedController.field.onChange(!isMasked);
              }}
              className={`flex size-7 items-center justify-center rounded-md transition-colors ${
                isMasked
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title={isMasked ? "Masked (Secret)" : "Unmasked (Public)"}
            >
              {isMasked ? (
                <ShieldIcon className="size-4" />
              ) : (
                <ShieldAlertIcon className="size-4" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={(): void => {
              onDelete(field.id);
            }}
            className="flex size-7 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
            title="Delete Field"
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {field.type !== "heading" && (
          <div className="w-full shrink-0 sm:w-1/3">
            <Input
              type="text"
              value={labelController.field.value}
              onChange={(e): void => {
                labelController.field.onChange(e.target.value);
              }}
              placeholder="Field Label (e.g. Username)"
              autoComplete="off"
              className="h-10 px-3 py-2 text-sm"
            />
          </div>
        )}
        <div className="w-full flex-1">
          <RendererComponent
            value={valueController.field.value}
            isEditing={true}
            isMasked={isMasked}
            onChange={(val): void => {
              valueController.field.onChange(val);
            }}
            onGenerate={
              field.type === "password" ? onGeneratePassword : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
