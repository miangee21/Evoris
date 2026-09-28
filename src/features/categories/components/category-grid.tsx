//src/features/categories/components/category-grid.tsx
import * as React from "react";
import { FolderOpenIcon, PlusIcon } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CategoryCard } from "./category-card";
import { EmptyState } from "@/shared/components/empty-state";
import type { Category } from "@/shared/types/vault.types";

interface CategoryGridProps {
  readonly categories: readonly Category[];
  readonly searchQuery: string;
  readonly getItemCount: (categoryId: string) => number;
  readonly onEdit: (category: Category) => void;
  readonly onDelete: (category: Category) => void;
  readonly onCreate: () => void;
}

function useGridColumns(): number {
  const [cols, setCols] = React.useState(3);

  React.useEffect(() => {
    const updateCols = (): void => {
      if (window.innerWidth >= 1024) setCols(3);
      else if (window.innerWidth >= 768) setCols(2);
      else setCols(1);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return (): void => {
      window.removeEventListener("resize", updateCols);
    };
  }, []);

  return cols;
}

export function CategoryGrid({
  categories,
  searchQuery,
  getItemCount,
  onEdit,
  onDelete,
  onCreate,
}: CategoryGridProps): React.JSX.Element {
  const cols = useGridColumns();

  const chunkedRows = React.useMemo(() => {
    const chunks = [];
    for (let i = 0; i < categories.length; i += cols) {
      chunks.push(categories.slice(i, i + cols));
    }
    return chunks;
  }, [categories, cols]);

  const rowVirtualizer = useVirtualizer({
    count: chunkedRows.length,
    getScrollElement: () => document.getElementById("evoris-page-container"),
    estimateSize: () => 194,
    overscan: 4,
  });

  if (categories.length === 0) {
    const isSearch = searchQuery.length > 0;

    return (
      <EmptyState
        icon={<FolderOpenIcon className="size-8 text-muted-foreground/60" />}
        title={isSearch ? "No categories found" : "No categories yet"}
        description={
          isSearch
            ? `We couldn't find any categories matching "${searchQuery}".`
            : "Create your first category to start organizing your vault items."
        }
        action={
          !isSearch ? (
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <PlusIcon className="size-4" />
              Create Category
            </button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="w-full">
      <div
        style={{
          height: `${String(rowVirtualizer.getTotalSize())}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = chunkedRows[virtualRow.index];
          if (!rowItems) return null;

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${String(virtualRow.size - 24)}px`,
                transform: `translateY(${String(virtualRow.start)}px)`,
              }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {rowItems.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  itemCount={getItemCount(category.id)}
                  onEdit={(): void => {
                    onEdit(category);
                  }}
                  onDelete={(): void => {
                    onDelete(category);
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
