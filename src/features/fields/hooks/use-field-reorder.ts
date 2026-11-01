//src/features/fields/hooks/use-field-reorder.ts
import type { UseFieldArrayMove } from "react-hook-form";

export interface UseFieldReorderReturn {
  readonly moveUp: (index: number) => void;
  readonly moveDown: (index: number, total: number) => void;
}

export function useFieldReorder(
  move: UseFieldArrayMove,
): UseFieldReorderReturn {
  const moveUp = (index: number): void => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const moveDown = (index: number, total: number): void => {
    if (index < total - 1) {
      move(index, index + 1);
    }
  };

  return { moveUp, moveDown };
}
