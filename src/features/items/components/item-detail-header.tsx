//src/features/items/components/item-detail-header.tsx
import * as React from "react";
import {
  ArrowLeftIcon,
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
} from "lucide-react";

interface ItemDetailHeaderProps {
  readonly isEditing: boolean;
  readonly isProcessing: boolean;
  readonly itemName: string;
  readonly onBack: () => void;
  readonly onEdit: () => void;
  readonly onCancel: () => void;
  readonly onDelete: () => void;
  readonly submitLabel?: string | undefined;
  readonly isCreateMode?: boolean | undefined;
}

export function ItemDetailHeader({
  isEditing,
  isProcessing,
  itemName,
  onBack,
  onEdit,
  onCancel,
  onDelete,
  submitLabel = "Save",
  isCreateMode = false,
}: ItemDetailHeaderProps): React.JSX.Element {
  const title = isEditing
    ? isCreateMode
      ? itemName || "Create New Item"
      : itemName
        ? `Editing: ${itemName}`
        : "Create New Item"
    : itemName;

  return (
    <div className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md sm:px-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <h1 className="line-clamp-1 text-lg font-semibold tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <XIcon className="size-4" />
              Cancel
            </button>

            <button
              type="submit"
              form="item-edit-form"
              disabled={isProcessing}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <CheckIcon className="size-4" />
              {submitLabel}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <PencilIcon className="size-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex size-9 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Delete item"
            >
              <Trash2Icon className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
