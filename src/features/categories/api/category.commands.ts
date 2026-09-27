//src/features/categories/api/category.commands.ts
import { invokeCommand } from "@/shared/lib/invoke";
import { z } from "zod";
import { categorySchema } from "@/shared/schemas/vault.schema";
import type { Result } from "@/shared/lib/result";
import type { EvorisError } from "@/shared/lib/errors";
import type { Category } from "@/shared/types/vault.types";

export async function createCategoryCmd(
  category: Category,
): Promise<Result<Category, EvorisError>> {
  return invokeCommand("create_category", { category }, categorySchema);
}

export async function updateCategoryCmd(
  category: Category,
): Promise<Result<Category, EvorisError>> {
  return invokeCommand("update_category", { category }, categorySchema);
}

export async function deleteCategoryCmd(
  id: string,
): Promise<Result<null, EvorisError>> {
  return invokeCommand("delete_category", { id }, z.null());
}
