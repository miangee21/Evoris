//src/features/trash/hooks/use-trash-mutations.ts
import { useState } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import {
  deleteItemPermanentlyCmd,
  emptyTrashCmd,
  restoreItemCmd,
} from "../api/trash.commands";
import { notifyError, notifySuccess } from "@/shared/lib/errors";
import type { Item } from "@/shared/types/vault.types";

export interface UseTrashMutationsResult {
  readonly isProcessing: boolean;
  readonly restoreItem: (item: Item) => Promise<boolean>;
  readonly deleteItemPermanently: (item: Item) => Promise<boolean>;
  readonly emptyTrash: () => Promise<boolean>;
}

export function useTrashMutations(): UseTrashMutationsResult {
  const [isProcessing, setIsProcessing] = useState(false);

  const restoreItemInStore = useSessionStore((s) => s.restoreItem);
  const deleteItemPermanentlyFromStore = useSessionStore(
    (s) => s.deleteItemPermanently,
  );
  const emptyTrashInStore = useSessionStore((s) => s.emptyTrash);

  const restoreItem = async (item: Item): Promise<boolean> => {
    setIsProcessing(true);
    const result = await restoreItemCmd(item.id);
    setIsProcessing(false);

    if (result.ok) {
      restoreItemInStore(result.value);
      notifySuccess(
        "Item Restored",
        `"${item.name}" has been restored to your vault.`,
      );
      return true;
    }

    notifyError(result.error, "Failed to Restore Item");
    return false;
  };

  const deleteItemPermanently = async (item: Item): Promise<boolean> => {
    setIsProcessing(true);
    const result = await deleteItemPermanentlyCmd(item.id);
    setIsProcessing(false);

    if (result.ok) {
      deleteItemPermanentlyFromStore(item.id);
      notifySuccess(
        "Item Permanently Deleted",
        `"${item.name}" has been permanently deleted.`,
      );
      return true;
    }

    notifyError(result.error, "Failed to Delete Item");
    return false;
  };

  const emptyTrash = async (): Promise<boolean> => {
    const count = useSessionStore.getState().trash.length;
    if (count === 0) return false;

    setIsProcessing(true);
    const result = await emptyTrashCmd();
    setIsProcessing(false);

    if (result.ok) {
      emptyTrashInStore();
      notifySuccess(
        "Trash Emptied",
        `${String(count)} ${count === 1 ? "item has" : "items have"} been permanently deleted.`,
      );
      return true;
    }

    notifyError(result.error, "Failed to Empty Trash");
    return false;
  };

  return {
    isProcessing,
    restoreItem,
    deleteItemPermanently,
    emptyTrash,
  };
}
