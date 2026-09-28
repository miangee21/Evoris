//src/features/items/components/item-empty-state.tsx
import * as React from "react";
import {
  PlusIcon,
  SearchXIcon,
  FolderOpenIcon,
  ShieldIcon,
} from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";

interface ItemEmptyStateProps {
  readonly totalItems: number;
  readonly searchQuery: string;
  readonly isFiltered: boolean;
  readonly onCreateNew: () => void;
}

export function ItemEmptyState({
  totalItems,
  searchQuery,
  isFiltered,
  onCreateNew,
}: ItemEmptyStateProps): React.JSX.Element {
  // Priority 1: Search query returned nothing
  if (searchQuery.trim().length > 0) {
    return (
      <EmptyState
        icon={<SearchXIcon className="size-8 text-muted-foreground/60" />}
        title="No items match your search"
        description={`We couldn't find anything matching "${searchQuery}".`}
      />
    );
  }

  // Priority 2: Category filter returned nothing
  if (isFiltered) {
    return (
      <EmptyState
        icon={<FolderOpenIcon className="size-8 text-muted-foreground/60" />}
        title="No items in this category"
        description="There are currently no items assigned to this category."
      />
    );
  }

  // Priority 3: Vault has absolutely no items yet
  if (totalItems === 0) {
    return (
      <EmptyState
        className="[&>div:first-child]:mb-1 [&>h3]:mb-1 [&>p]:mb-2"
        icon={<ShieldIcon className="size-8 text-muted-foreground/60" />}
        title="No items yet"
        description="Create your first item to securely store and manage your data."
        action={
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <PlusIcon className="size-4" />
            Create Item
          </button>
        }
      />
    );
  }

  return <></>; // Fallback, shouldn't render if items exist
}
