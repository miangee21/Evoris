//src/features/items/components/item-grid.tsx
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ItemCard } from "./item-card";
import type { Item } from "@/shared/types/vault.types";

interface ItemGridProps {
  readonly items: readonly Item[];
}

function useGridColumns(): number {
  const [cols, setCols] = React.useState(3);

  React.useEffect(() => {
    const updateCols = (): void => {
      if (window.innerWidth >= 1024) setCols(3);
      else if (window.innerWidth >= 768) setCols(2);
      else setCols(1);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return (): void => {
      window.removeEventListener("resize", updateCols);
    };
  }, []);

  return cols;
}

export function ItemGrid({ items }: ItemGridProps): React.JSX.Element {
  const cols = useGridColumns();

  const chunkedRows = React.useMemo(() => {
    const chunks = [];
    for (let i = 0; i < items.length; i += cols) {
      chunks.push(items.slice(i, i + cols));
    }
    return chunks;
  }, [items, cols]);

  const rowVirtualizer = useVirtualizer({
    count: chunkedRows.length,
    getScrollElement: () => document.getElementById("evoris-page-container"),
    estimateSize: () => 194,
    overscan: 4,
  });

  return (
    <div className="w-full">
      <div
        style={{
          height: `${String(rowVirtualizer.getTotalSize())}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = chunkedRows[virtualRow.index];
          if (!rowItems) return null;

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${String(virtualRow.size - 24)}px`,
                transform: `translateY(${String(virtualRow.start)}px)`,
              }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {rowItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
