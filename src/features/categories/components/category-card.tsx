//src/features/categories/components/category-card.tsx
import * as React from "react";
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
  const IconComponent = CATEGORY_ICONS[category.icon] ?? FALLBACK_ICON;

  const catColor = category.color || "var(--color-primary)";
  const bgOpacity = `color-mix(in srgb, ${catColor} 12%, transparent)`;

  return (
    <div
      className={cn(
        "group flex min-h-42.5 flex-col justify-between rounded-3xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isPreview ? "border-dashed border-border/60" : "border-border/50",
      )}
    >
      {/* Top Row: Squircle Icon & Items Count Pill */}
      <div className="flex items-start justify-between">
        <div
          className="flex size-12 items-center justify-center rounded-2xl transition-colors"
          style={{ backgroundColor: bgOpacity, color: catColor }}
        >
          <IconComponent className="size-6" />
        </div>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: bgOpacity, color: catColor }}
          >
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Middle Content: Title Only */}
      <div className="mt-4">
        <h2 className="line-clamp-1 text-lg font-bold tracking-tight text-card-foreground">
          {category.name || "Unnamed Category"}
        </h2>
      </div>

      {/* Bottom Actions: Date & Edit/Delete Buttons */}
      <div className="mb-2 mt-auto flex items-center justify-between">
        <p className="text-sm font-normal text-muted-foreground">
          {category.updated_at
            ? `Updated ${new Date(
                isNaN(Number(category.updated_at))
                  ? category.updated_at
                  : Number(category.updated_at) * 1000,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`
            : "Just now"}
        </p>

        {!isPreview && (
          <div className="flex items-center space-x-3">
            {onEdit && (
              <button
                type="button"
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                title="Edit"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit();
                }}
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                title="Delete"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
