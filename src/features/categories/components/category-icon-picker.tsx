//src/features/categories/components/category-icon-picker.tsx
import type React from "react";
import { CATEGORY_ICONS } from "../constants/category-icons";
import { cn } from "@/shared/lib/utils";

interface CategoryIconPickerProps {
  readonly selectedIcon: string;
  readonly selectedColor: string;
  readonly onSelect: (icon: string) => void;
}

export function CategoryIconPicker({
  selectedIcon,
  selectedColor,
  onSelect,
}: CategoryIconPickerProps): React.JSX.Element {
  return (
    <div className="grid max-h-60 grid-cols-5 gap-2 overflow-y-auto p-1 sm:grid-cols-6 custom-scrollbar">
      {Object.entries(CATEGORY_ICONS).map(([key, IconComponent]) => {
        const isActive = selectedIcon === key;

        return (
          <button
            key={key}
            type="button"
            onClick={(): void => {
              onSelect(key);
            }}
            className={cn(
              "flex size-10 items-center justify-center rounded-xl border transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2",
              isActive
                ? "shadow-sm border-transparent"
                : "border-transparent bg-transparent opacity-60 hover:opacity-100",
            )}
            style={
              isActive
                ? {
                    backgroundColor: `${selectedColor}33`,
                    color: selectedColor,
                    // Dynamic accent ring
                    boxShadow: `0 0 0 2px ${selectedColor}80`,
                  }
                : {}
            }
            title={key.replace("_", " ")}
          >
            <IconComponent className="size-5" />
          </button>
        );
      })}
    </div>
  );
}
