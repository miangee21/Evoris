//src/features/trash/components/trash-list.tsx
import * as React from "react";
import { TrashRow } from "./trash-row";
import type { Item } from "@/shared/types/vault.types";

interface TrashListProps {
  readonly items: readonly Item[];
  readonly isProcessing: boolean;
  readonly onRestore: (item: Item) => void;
  readonly onDeletePermanently: (item: Item) => void;
}

export function TrashList({
  items,
  isProcessing,
  onRestore,
  onDeletePermanently,
}: TrashListProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <TrashRow
          key={item.id}
          item={item}
          isProcessing={isProcessing}
          onRestore={onRestore}
          onDeletePermanently={onDeletePermanently}
        />
      ))}
    </div>
  );
}
