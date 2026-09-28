//src/features/items/components/items-page.tsx
import * as React from "react";
import { PlusIcon } from "lucide-react";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { SearchInput } from "@/shared/components/search-input";
import { useItemSearch } from "../hooks/use-item-search";
import { ItemCategoryFilter } from "./item-category-filter";
import { ItemGrid } from "./item-grid";
import { ItemEmptyState } from "./item-empty-state";

export function ItemsPage(): React.JSX.Element {
  const {
    filteredItems,
    totalItems,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useItemSearch();

  const handleCreateNew = (): void => {
    // Phase 12 mein hum yahan routing lagayenge (e.g. navigate("/vault/new"))
    alert(
      "Next Step: Yahan se hum Naya Item create karne wale page par jayenge!",
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Vault"
        description="Manage your passwords, notes, and sensitive data."
        actions={
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {/* 1. Search Input */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={(): void => {
                setSearchQuery("");
              }}
              placeholder="Search items..."
            />

            {/* 2. Category Filter */}
            <ItemCategoryFilter
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
            />

            {/* 3. New Item Button */}
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Create New Item"
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        }
      />

      {/* Content Container */}
      <div className="w-full px-6 pb-24 sm:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-2">
          {filteredItems.length > 0 ? (
            <ItemGrid items={filteredItems} />
          ) : (
            <ItemEmptyState
              totalItems={totalItems}
              searchQuery={searchQuery}
              isFiltered={selectedCategoryId !== "all"}
              onCreateNew={handleCreateNew}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
