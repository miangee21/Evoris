//src/features/categories/hooks/use-categories.ts
import { useState, useMemo } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { useDebounce } from "@/shared/hooks/use-debounced-value";
import { sortByName } from "@/shared/lib/sort";
import type { Category } from "@/shared/types/vault.types";

export interface UseCategoriesResult {
  readonly categories: Category[];
  readonly totalCategories: number;
  readonly searchQuery: string;
  readonly setSearchQuery: (query: string) => void;
  readonly getItemCount: (categoryId: string) => number;
  readonly getTrashedItemCount: (categoryId: string) => number;
}

export function useCategories(): UseCategoriesResult {
  const categories = useSessionStore((state) => state.categories);
  const items = useSessionStore((state) => state.items);
  const trash = useSessionStore((state) => state.trash);
  const [searchQuery, setSearchQuery] = useState("");

  // 300ms delay debounce for smooth typing performance
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredAndSortedCategories = useMemo(() => {
    // 1. Filter using the debounced query
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );

    // 2. Sort alphabetically using our global sorting utility
    return sortByName(filtered, (c) => c.name);
  }, [categories, debouncedQuery]);

  // Utility to get item count for a specific category
  const getItemCount = (categoryId: string): number => {
    return items.filter((item) => item.category_id === categoryId).length;
  };

  // Utility to get trashed item count for a specific category
  const getTrashedItemCount = (categoryId: string): number => {
    return trash.filter((item) => item.category_id === categoryId).length;
  };

  return {
    categories: filteredAndSortedCategories,
    totalCategories: categories.length,
    searchQuery,
    setSearchQuery,
    getItemCount,
    getTrashedItemCount,
  };
}
