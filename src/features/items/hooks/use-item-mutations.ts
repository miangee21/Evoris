//src/features/items/hooks/use-item-mutations.ts
import { useState } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import {
  createItemCmd,
  updateItemCmd,
  deleteItemCmd,
} from "../api/item.commands";
import { notifySuccess, notifyError } from "@/shared/lib/errors";
import type { Item } from "@/shared/types/vault.types";

interface UseItemMutationsReturn {
  isProcessing: boolean;
  createItem: (item: Item) => Promise<boolean>;
  updateItem: (item: Item) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
}

export function useItemMutations(): UseItemMutationsReturn {
  const [isProcessing, setIsProcessing] = useState(false);

  // Store actions
  const addItem = useSessionStore((state) => state.addItem);
  const updateItemStore = useSessionStore((state) => state.updateItem);
  const deleteItemStore = useSessionStore((state) => state.deleteItem);

  const createItem = async (item: Item): Promise<boolean> => {
    setIsProcessing(true);
    const result = await createItemCmd(item);
    setIsProcessing(false);

    if (result.ok) {
      addItem(result.value);
      notifySuccess(
        "Item Created Successfully",
        `"${item.name}" has been added to your vault.`,
      );
      return true;
    }

    notifyError(result.error, "Failed to Create Item");
    return false;
  };

  const updateItem = async (item: Item): Promise<boolean> => {
    setIsProcessing(true);
    const result = await updateItemCmd(item);
    setIsProcessing(false);

    if (result.ok) {
      updateItemStore(result.value);
      notifySuccess(
        "Item Updated Successfully",
        `"${item.name}" has been updated.`,
      );
      return true;
    }

    notifyError(result.error, "Failed to Update Item");
    return false;
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    const items = useSessionStore.getState().items;
    const itemToDelete = items.find((i) => i.id === id);
    const itemName = itemToDelete ? itemToDelete.name : "Item";

    setIsProcessing(true);
    const result = await deleteItemCmd(id);
    setIsProcessing(false);

    if (result.ok) {
      deleteItemStore(id, result.value);
      notifySuccess(
        "Moved to Trash",
        `"${itemName}" has been securely moved to the trash.`,
      );
      return true;
    }

    notifyError(result.error, "Failed to Delete Item");
    return false;
  };

  return {
    isProcessing,
    createItem,
    updateItem,
    deleteItem,
  };
}
