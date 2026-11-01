//src/features/fields/components/renderers/email-field.tsx
import * as React from "react";
import type { FieldRendererProps } from "./text-field";

export function EmailField({
  value,
  isEditing,
  isMasked,
  onChange,
}: FieldRendererProps): React.JSX.Element {
  if (!isEditing) {
    return (
      <p className="text-sm text-foreground break-all">
        {isMasked ? "•".repeat(Math.max(8, value.length)) : value || "—"}
      </p>
    );
  }

  return (
    <input
      type={isMasked ? "password" : "email"}
      value={value}
      onChange={(e): void => {
        onChange(e.target.value);
      }}
      placeholder="name@example.com"
      autoComplete="off"
      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
