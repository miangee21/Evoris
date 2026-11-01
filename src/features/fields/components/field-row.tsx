//src/features/fields/components/field-row.tsx
import * as React from "react";
import { useState } from "react";
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
import { FieldRowEdit } from "./field-row-edit";
import { FieldReorderHandle } from "./field-reorder-handle";
import { FieldReorderArrows } from "./field-reorder-arrows";
import { CopyButton } from "@/shared/components/copy-button";
import { RevealToggle } from "@/shared/components/reveal-toggle";
import { Input } from "@/shared/components/ui/input";
import type { FieldValues } from "../schemas/field.schema";
import type { ItemFormValues } from "@/features/items/schemas/item.schema";

interface FieldRowProps {
  readonly field: FieldValues;
  readonly index: number;
  readonly totalFields: number;
  readonly isEditing: boolean;
  readonly onUpdate: (id: string, updates: Partial<FieldValues>) => void;
  readonly onDelete: (id: string) => void;
  readonly onMoveUp: (id: string) => void;
  readonly onMoveDown: (id: string) => void;
  readonly control?: Control<ItemFormValues> | undefined;
  readonly dragHandleAttributes?: DraggableAttributes | undefined;
  readonly dragHandleListeners?: DraggableSyntheticListeners | undefined;
  // Password-generator callback for this row (edit mode, password fields).
  readonly onGeneratePassword?: (() => void) | undefined;
}

export function FieldRow({
  field,
  index,
  totalFields,
  isEditing,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  control,
  dragHandleAttributes,
  dragHandleListeners,
  onGeneratePassword,
}: FieldRowProps): React.JSX.Element {
  // Temporary view state to peek masked values in View Mode
  const [isRevealed, setIsRevealed] = useState(false);

  const fieldTypeConfig = FIELD_TYPES.find((t) => t.key === field.type);
  const RendererComponent = rendererFor(field.type);

  // --- VIEW MODE ---
  if (!isEditing) {
    return (
      <div className="group flex flex-col gap-1 border-b border-border/40 py-3 last:border-0">
        {field.type !== "heading" && (
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {field.label !== ""
              ? field.label
              : (fieldTypeConfig?.label ?? "Unknown Field")}
          </span>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="w-full flex-1 overflow-hidden">
            <RendererComponent
              value={field.value}
              isEditing={false}
              isMasked={field.masked && !isRevealed}
              onChange={(): void => undefined} // Read-only
            />
          </div>

          {field.type !== "heading" && (
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0">
              {field.masked && (
                <RevealToggle
                  isRevealed={isRevealed}
                  onToggle={(): void => {
                    setIsRevealed(!isRevealed);
                  }}
                />
              )}
              {field.value.length > 0 && <CopyButton value={field.value} />}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- EDIT MODE, registered inputs (used by the item edit form) ---
  if (control !== undefined) {
    return (
      <FieldRowEdit
        field={field}
        index={index}
        totalFields={totalFields}
        control={control}
        dragHandleAttributes={dragHandleAttributes}
        dragHandleListeners={dragHandleListeners}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onGeneratePassword={onGeneratePassword}
      />
    );
  }

  // --- EDIT MODE, legacy prop-driven fallback (no form control) ---
  const IconComponent = fieldTypeConfig?.icon ?? GripVerticalIcon;
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
                onUpdate(field.id, { masked: !field.masked });
              }}
              className={`flex size-7 items-center justify-center rounded-md transition-colors ${
                field.masked
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title={field.masked ? "Masked (Secret)" : "Unmasked (Public)"}
            >
              {field.masked ? (
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
              value={field.label}
              onChange={(e): void => {
                onUpdate(field.id, { label: e.target.value });
              }}
              placeholder="Field Label (e.g. Username)"
              autoComplete="off"
              className="h-10 px-3 py-2 text-sm"
            />
          </div>
        )}
        <div className="w-full flex-1">
          <RendererComponent
            value={field.value}
            isEditing={true}
            isMasked={field.masked}
            onChange={(val): void => {
              onUpdate(field.id, { value: val });
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
