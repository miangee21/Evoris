//src/features/trash/components/trash-row.tsx
import * as React from "react";
import { FolderOpenIcon } from "lucide-react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import {
  categoryBadgeStyle,
  getCategoryIcon,
} from "@/features/categories/lib/category-display";
import { formatRelativeTime } from "@/shared/lib/relative-time";
import { Button } from "@/shared/components/ui/button";
import type { Item } from "@/shared/types/vault.types";

interface TrashRowProps {
  readonly item: Item;
  readonly isProcessing: boolean;
  readonly onRestore: (item: Item) => void;
  readonly onDeletePermanently: (item: Item) => void;
}

export function TrashRow({
  item,
  isProcessing,
  onRestore,
  onDeletePermanently,
}: TrashRowProps): React.JSX.Element {
  const categories = useSessionStore((state) => state.categories);
  const category = categories.find((c) => c.id === item.category_id);
  const IconComponent = category
    ? getCategoryIcon(category.icon)
    : FolderOpenIcon;
  const badgeStyle = categoryBadgeStyle(category?.color ?? null);

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
        style={badgeStyle}
      >
        <IconComponent className="size-6" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-1 text-lg font-bold tracking-tight text-card-foreground">
          {item.name}
        </h2>
        <p className="text-sm font-normal text-muted-foreground">
          {`Deleted ${formatRelativeTime(item.deleted_at)}`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={(): void => {
            onRestore(item);
          }}
          disabled={isProcessing}
        >
          Restore
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={(): void => {
            onDeletePermanently(item);
          }}
          disabled={isProcessing}
        >
          Delete permanently
        </Button>
      </div>
    </div>
  );
}
