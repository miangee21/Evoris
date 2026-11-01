//src/features/trash/components/trash-page.tsx
import * as React from "react";
import { useMemo, useState } from "react";
import { SearchXIcon, Trash2Icon } from "lucide-react";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/empty-state";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { useConfirmStore } from "@/shared/hooks/use-confirm";
import { useDebounce } from "@/shared/hooks/use-debounced-value";
import { SEARCH_DEBOUNCE_MS } from "@/shared/constants/limits";
import { sortByName } from "@/shared/lib/sort";
import { TrashList } from "./trash-list";
import { TrashSearchBar } from "./trash-search-bar";
import { EmptyTrashButton } from "./empty-trash-button";
import { useTrashMutations } from "../hooks/use-trash-mutations";
import type { Item } from "@/shared/types/vault.types";

export function TrashPage(): React.JSX.Element {
  const trash = useSessionStore((state) => state.trash);
  const { isProcessing, restoreItem, deleteItemPermanently, emptyTrash } =
    useTrashMutations();
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const filteredItems = useMemo(() => {
    let result = trash;
    if (debouncedQuery.trim().length > 0) {
      const lowerQuery = debouncedQuery.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery),
      );
    }
    return sortByName(result, (item) => item.name);
  }, [trash, debouncedQuery]);

  const handleRestore = (item: Item): void => {
    openConfirm({
      title: "Restore Item",
      description: "Restore this item to your vault?",
      confirmLabel: "Restore",
      cancelLabel: "Cancel",
      variant: "default",
      onConfirm: async (): Promise<void> => {
        await restoreItem(item);
      },
    });
  };

  const handleDeletePermanently = (item: Item): void => {
    openConfirm({
      title: "Delete Permanently",
      description: "Permanently delete this item? This cannot be undone.",
      confirmLabel: "Delete permanently",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async (): Promise<void> => {
        await deleteItemPermanently(item);
      },
    });
  };

  const handleEmptyTrash = (): void => {
    const count = trash.length;
    openConfirm({
      title: "Empty Trash",
      description: `Permanently delete all ${String(count)} items in the trash? This cannot be undone.`,
      confirmLabel: "Empty Trash",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async (): Promise<void> => {
        await emptyTrash();
      },
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Trash"
        description="Items in the trash can be restored or permanently deleted."
        actions={
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <TrashSearchBar value={searchQuery} onChange={setSearchQuery} />
            <EmptyTrashButton
              trashCount={trash.length}
              disabled={trash.length === 0 || isProcessing}
              onClick={handleEmptyTrash}
            />
          </div>
        }
      />

      <div className="w-full px-6 pb-24 sm:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-2">
          {filteredItems.length > 0 ? (
            <TrashList
              items={filteredItems}
              isProcessing={isProcessing}
              onRestore={handleRestore}
              onDeletePermanently={handleDeletePermanently}
            />
          ) : searchQuery.trim().length > 0 && trash.length > 0 ? (
            <EmptyState
              icon={<SearchXIcon className="size-8 text-muted-foreground/60" />}
              title="No items match your search"
              description={`We couldn't find anything matching "${searchQuery}".`}
            />
          ) : (
            <EmptyState
              icon={<Trash2Icon className="size-8 text-muted-foreground/60" />}
              title="Trash is empty"
              description="Items you delete will appear here until you restore or permanently delete them."
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
