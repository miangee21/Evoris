//src/features/categories/components/category-card.tsx
import type React from "react";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { CATEGORY_ICONS, FALLBACK_ICON } from "../constants/category-icons";
import { cn } from "@/shared/lib/utils";
import type { Category } from "@/shared/types/vault.types";

interface CategoryCardProps {
  readonly category: Category;
  readonly itemCount: number;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly isPreview?: boolean;
}

export function CategoryCard({
  category,
  itemCount,
  onEdit,
  onDelete,
  isPreview = false,
}: CategoryCardProps): React.JSX.Element {
  // Safe fallback if icon removed from library
  const IconComponent = CATEGORY_ICONS[category.icon] ?? FALLBACK_ICON;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 transition-all duration-normal shadow-md",
        isPreview ? "border-dashed border-border/60" : "border-border",
      )}
    >
      <div className="flex items-start justify-between">
        {/* Dynamic Color Icon Container */}
        <div
          className="flex size-12 items-center justify-center rounded-2xl shadow-sm transition-colors duration-300"
          style={{
            backgroundColor: `${category.color}26`,
            color: category.color,
          }}
        >
          <IconComponent className="size-6" />
        </div>

        {/* Action Buttons (Hidden in preview mode) */}
        {!isPreview && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-normal focus-within:opacity-100 group-hover:opacity-100">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Edit category"
              >
                <Edit2Icon className="size-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                aria-label="Delete category"
              >
                <Trash2Icon className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="truncate font-semibold tracking-tight text-foreground">
          {category.name || "Unnamed Category"}
        </h3>
        <p className="text-xs font-medium text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>
    </div>
  );
}
