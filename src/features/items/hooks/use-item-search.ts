//src/features/items/hooks/use-item-search.ts
import { useState, useMemo } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { useDebounce } from "@/shared/hooks/use-debounced-value";
import { sortByName } from "@/shared/lib/sort";
import type { Item } from "@/shared/types/vault.types";

export interface UseItemSearchResult {
  readonly filteredItems: readonly Item[];
  readonly totalItems: number;
  readonly searchQuery: string;
  readonly setSearchQuery: (query: string) => void;
  readonly selectedCategoryId: string;
  readonly setSelectedCategoryId: (id: string) => void;
}

export function useItemSearch(): UseItemSearchResult {
  const items = useSessionStore((state) => state.items);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  // 300ms debounce
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredItems = useMemo(() => {
    // 1. Filter by Category
    let result = items;
    if (selectedCategoryId === "uncategorized") {
      result = result.filter((item) => item.category_id === null);
    } else if (selectedCategoryId !== "all") {
      result = result.filter((item) => item.category_id === selectedCategoryId);
    }

    // 2. Filter by Search Query (STRICTLY on item.name only)
    if (debouncedQuery.trim().length > 0) {
      const lowerQuery = debouncedQuery.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery),
      );
    }

    // 3. Sort by Name (Using the strict compareEvorisStrings logic)
    return sortByName(result, (item) => item.name);
  }, [items, selectedCategoryId, debouncedQuery]);

  return {
    filteredItems,
    totalItems: items.length,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
  };
}
