//src/features/fields/components/field-list.tsx
import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  Control,
  FieldArrayWithId,
  UseFormSetValue,
} from "react-hook-form";
import { FieldRow } from "./field-row";
import type { FieldValues } from "../schemas/field.schema";
import { fieldPath } from "../lib/field-path";
import type { ItemFormValues } from "@/features/items/schemas/item.schema";

export interface FieldListProps {
  readonly fields: readonly FieldArrayWithId<
    ItemFormValues,
    "fields",
    "fieldKey"
  >[];
  readonly control: Control<ItemFormValues>;
  readonly setValue: UseFormSetValue<ItemFormValues>;
  readonly onRemove: (index: number) => void;
  readonly onMoveUp: (index: number) => void;
  readonly onMoveDown: (index: number, total: number) => void;
  readonly onMove: (fromIndex: number, toIndex: number) => void;
  readonly onGeneratePassword?: ((index: number) => void) | undefined;
}

interface SortableFieldRowProps {
  readonly field: FieldArrayWithId<ItemFormValues, "fields", "fieldKey">;
  readonly index: number;
  readonly totalFields: number;
  readonly control: Control<ItemFormValues>;
  readonly setValue: UseFormSetValue<ItemFormValues>;
  readonly onRemove: (index: number) => void;
  readonly onMoveUp: (index: number) => void;
  readonly onMoveDown: (index: number, total: number) => void;
  readonly onGeneratePassword?: ((index: number) => void) | undefined;
}

function SortableFieldRow({
  field,
  index,
  totalFields,
  control,
  setValue,
  onRemove,
  onMoveUp,
  onMoveDown,
  onGeneratePassword,
}: SortableFieldRowProps): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const handleUpdate = (id: string, updates: Partial<FieldValues>): void => {
    if (id !== field.id) {
      return;
    }
    if (updates.label !== undefined) {
      setValue(fieldPath(index, "label"), updates.label, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (updates.value !== undefined) {
      setValue(fieldPath(index, "value"), updates.value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (updates.masked !== undefined) {
      setValue(fieldPath(index, "masked"), updates.masked, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <FieldRow
        field={field}
        index={index}
        totalFields={totalFields}
        isEditing={true}
        control={control}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
        onUpdate={handleUpdate}
        onDelete={(): void => {
          onRemove(index);
        }}
        onMoveUp={(): void => {
          onMoveUp(index);
        }}
        onMoveDown={(): void => {
          onMoveDown(index, totalFields);
        }}
        onGeneratePassword={
          onGeneratePassword === undefined
            ? undefined
            : (): void => {
                onGeneratePassword(index);
              }
        }
      />
    </div>
  );
}

export function FieldList({
  fields,
  control,
  setValue,
  onRemove,
  onMoveUp,
  onMoveDown,
  onMove,
  onGeneratePassword,
}: FieldListProps): React.JSX.Element {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (over === null || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onMove(oldIndex, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={fields.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <SortableFieldRow
              key={field.id}
              field={field}
              index={index}
              totalFields={fields.length}
              control={control}
              setValue={setValue}
              onRemove={onRemove}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onGeneratePassword={onGeneratePassword}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
