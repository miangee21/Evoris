//src/features/items/api/item.commands.ts
import { invoke } from "@tauri-apps/api/core";
import type { Item } from "@/shared/types/vault.types";

// Standard command result pattern
export type ItemCmdResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export async function createItemCmd(item: Item): Promise<ItemCmdResult<Item>> {
  try {
    const result = await invoke<Item>("create_item", { item });
    return { ok: true, value: result };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function updateItemCmd(item: Item): Promise<ItemCmdResult<Item>> {
  try {
    const result = await invoke<Item>("update_item", { item });
    return { ok: true, value: result };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function deleteItemCmd(
  id: string,
): Promise<ItemCmdResult<boolean>> {
  try {
    await invoke("delete_item", { id });
    return { ok: true, value: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
