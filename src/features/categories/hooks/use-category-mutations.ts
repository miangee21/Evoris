//src/features/categories/hooks/use-category-mutations.ts
import { useState } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import {
  createCategoryCmd,
  updateCategoryCmd,
  deleteCategoryCmd,
} from "../api/category.commands";
import { notifyError } from "@/shared/lib/errors";
import { toast } from "sonner";
import type { Category } from "@/shared/types/vault.types";

export interface UseCategoryMutationsResult {
  isProcessing: boolean;
  createCategory: (category: Category) => Promise<boolean>;
  updateCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

export function useCategoryMutations(): UseCategoryMutationsResult {
  const [isProcessing, setIsProcessing] = useState(false);

  const addCategoryToStore = useSessionStore((s) => s.addCategory);
  const updateCategoryInStore = useSessionStore((s) => s.updateCategory);
  const deleteCategoryFromStore = useSessionStore((s) => s.deleteCategory);

  const createCategory = async (category: Category): Promise<boolean> => {
    setIsProcessing(true);
    const result = await createCategoryCmd(category);

    if (result.ok) {
      addCategoryToStore(result.value);
      toast.success("Category Created Successfully", {
        description: `"${category.name}" has been added to your vault.`,
      });
    } else {
      notifyError(result.error);
    }

    setIsProcessing(false);
    return result.ok;
  };

  const updateCategory = async (category: Category): Promise<boolean> => {
    setIsProcessing(true);
    const result = await updateCategoryCmd(category);

    if (result.ok) {
      updateCategoryInStore(result.value);
      toast.success("Category Updated", {
        description: `Changes to "${category.name}" have been saved.`,
      });
    } else {
      notifyError(result.error);
    }

    setIsProcessing(false);
    return result.ok;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setIsProcessing(true);
    const result = await deleteCategoryCmd(id);

    if (result.ok) {
      deleteCategoryFromStore(id);
      toast.success("Category Deleted", {
        description: "The category has been permanently removed.",
      });
    } else {
      notifyError(result.error);
    }

    setIsProcessing(false);
    return result.ok;
  };

  return {
    isProcessing,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
