//src/features/categories/components/categories-page.tsx
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { SearchInput } from "@/shared/components/search-input";
import { CategoryGrid } from "./category-grid";
import { CategoryFormModal } from "./category-form-modal";
import { useCategories } from "../hooks/use-categories";
import { useCategoryMutations } from "../hooks/use-category-mutations";
import { useConfirmStore } from "@/shared/hooks/use-confirm";
import type { Category } from "@/shared/types/vault.types";
import type { CategoryModalState } from "../types/category.types";
import type React from "react";

export function CategoriesPage(): React.JSX.Element {
  const { categories, searchQuery, setSearchQuery, getItemCount } =
    useCategories();
  const { isProcessing, createCategory, updateCategory, deleteCategory } =
    useCategoryMutations();
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  const [modalState, setModalState] = useState<CategoryModalState>({
    isOpen: false,
    mode: "create",
    defaultValues: null,
  });

  const handleCreateNew = (): void => {
    setModalState({
      isOpen: true,
      mode: "create",
      defaultValues: null,
    });
  };

  const handleEdit = (category: Category): void => {
    setModalState({
      isOpen: true,
      mode: "edit",
      defaultValues: category,
    });
  };

  const handleDelete = (category: Category): void => {
    const count = getItemCount(category.id);
    const warningText =
      count > 0
        ? `This will also leave ${String(count)} ${count === 1 ? "item" : "items"} uncategorized.`
        : "There are no items currently using this category.";

    openConfirm({
      title: "Delete Category",
      description: `Are you sure you want to delete "${category.name}"? ${warningText} This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async (): Promise<void> => {
        await deleteCategory(category.id);
      },
    });
  };

  const handleModalSubmit = async (data: Category): Promise<boolean> => {
    if (modalState.mode === "create") {
      return await createCategory(data);
    }
    return await updateCategory(data);
  };

  const closeModal = (): void => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <PageContainer>
      <PageHeader
        title="Categories"
        description="Organize your vault items into custom categories."
        actions={
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={(): void => {
                setSearchQuery("");
              }}
              placeholder="Search categories..."
            />
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Create New Category"
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        }
      />

      {/* Content Container */}
      <div className="w-full px-6 pb-24 sm:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-2">
          {/* Grid Layout */}
          <CategoryGrid
            categories={categories}
            searchQuery={searchQuery}
            getItemCount={getItemCount}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateNew}
          />
        </div>
      </div>

      <CategoryFormModal
        state={modalState}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        isProcessing={isProcessing}
      />
    </PageContainer>
  );
}
