//src/features/fields/components/renderers/heading-field.tsx
import * as React from "react";
import type { FieldRendererProps } from "./text-field";

export function HeadingField({
  value,
  isEditing,
  onChange,
}: FieldRendererProps): React.JSX.Element {
  if (!isEditing) {
    return (
      <h3 className="mb-2 mt-6 text-lg font-bold tracking-tight text-foreground">
        {value || "Unnamed Section"}
      </h3>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e): void => {
        onChange(e.target.value);
      }}
      placeholder="Section Heading..."
      autoComplete="off"
      className="flex h-10 w-full rounded-md border border-input bg-accent/30 px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
