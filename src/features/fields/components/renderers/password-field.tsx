//src/features/fields/components/renderers/password-field.tsx
import * as React from "react";
import { PasswordInput } from "@/shared/components/password-input";
import type { FieldRendererProps } from "./text-field";

export function PasswordField({
  value,
  isEditing,
  isMasked,
  onChange,
  onGenerate,
}: FieldRendererProps): React.JSX.Element {
  if (!isEditing) {
    return (
      <p className="break-all font-mono text-sm text-foreground">
        {isMasked ? "•".repeat(Math.max(8, value.length || 8)) : value || "—"}
      </p>
    );
  }

  if (onGenerate === undefined) {
    return (
      <PasswordInput
        value={value}
        onChange={(e): void => {
          onChange(e.target.value);
        }}
        placeholder="Enter password..."
        spellCheck={false}
      />
    );
  }

  return (
    <PasswordInput
      value={value}
      onChange={(e): void => {
        onChange(e.target.value);
      }}
      placeholder="Enter password..."
      showGenerator={true}
      onGenerate={onGenerate}
      spellCheck={false}
    />
  );
}
