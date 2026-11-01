//src/features/trash/api/trash.commands.ts
import { invokeCommand } from "@/shared/lib/invoke";
import { itemSchema } from "@/shared/schemas/vault.schema";
import { z } from "zod";
import type { Item } from "@/shared/types/vault.types";
import type { Result } from "@/shared/lib/result";
import type { EvorisError } from "@/shared/lib/errors";

export async function listTrashCmd(): Promise<Result<Item[], EvorisError>> {
  return invokeCommand("list_trash", undefined, z.array(itemSchema));
}

export async function restoreItemCmd(
  id: string,
): Promise<Result<Item, EvorisError>> {
  return invokeCommand("restore_item", { id }, itemSchema);
}

export async function deleteItemPermanentlyCmd(
  id: string,
): Promise<Result<null, EvorisError>> {
  return invokeCommand("delete_item_permanently", { id }, z.null());
}

export async function emptyTrashCmd(): Promise<Result<null, EvorisError>> {
  return invokeCommand("empty_trash", undefined, z.null());
}
