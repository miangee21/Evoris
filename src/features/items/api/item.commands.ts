//src/features/items/api/item.commands.ts
import { invokeCommand } from "@/shared/lib/invoke";
import { itemSchema } from "@/shared/schemas/vault.schema";
import type { Item } from "@/shared/types/vault.types";
import type { Result } from "@/shared/lib/result";
import type { EvorisError } from "@/shared/lib/errors";

export async function createItemCmd(
  item: Item,
): Promise<Result<Item, EvorisError>> {
  return await invokeCommand("create_item", { item }, itemSchema);
}

export async function updateItemCmd(
  item: Item,
): Promise<Result<Item, EvorisError>> {
  return await invokeCommand("update_item", { item }, itemSchema);
}

export async function deleteItemCmd(
  id: string,
): Promise<Result<Item, EvorisError>> {
  // Rust delete_item returns the updated (trashed) item, including deleted_at.
  return await invokeCommand("delete_item", { id }, itemSchema);
}
