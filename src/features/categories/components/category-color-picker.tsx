//src/features/categories/components/category-color-picker.tsx
import type React from "react";
import { HexColorPicker } from "react-colorful";

interface CategoryColorPickerProps {
  readonly color: string;
  readonly onChange: (color: string) => void;
}

export function CategoryColorPicker({
  color,
  onChange,
}: CategoryColorPickerProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <HexColorPicker
        color={color}
        onChange={onChange}
        className="w-full! h-45! rounded-lg shadow-sm"
      />
    </div>
  );
}
