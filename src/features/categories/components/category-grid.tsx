//src/features/categories/components/category-grid.tsx
import type React from "react";
import { FolderOpenIcon, PlusIcon } from "lucide-react";
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

export function CategoryGrid({
  categories,
  searchQuery,
  getItemCount,
  onEdit,
  onDelete,
  onCreate,
}: CategoryGridProps): React.JSX.Element {
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 animate-in fade-in duration-normal">
      {categories.map((category) => (
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
}
