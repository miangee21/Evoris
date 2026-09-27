//src/features/categories/types/category.types.ts
import type { Category } from "@/shared/types/vault.types";

export type CategoryFormMode = "create" | "edit";

export interface CategoryModalState {
  readonly isOpen: boolean;
  readonly mode: CategoryFormMode;
  readonly defaultValues: Category | null;
}
