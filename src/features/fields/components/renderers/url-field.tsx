//src/features/fields/components/renderers/url-field.tsx
import * as React from "react";
import { ExternalLinkIcon } from "lucide-react";
import { open } from "@tauri-apps/plugin-shell";
import { useConfirmStore } from "@/shared/hooks/use-confirm";
import type { FieldRendererProps } from "./text-field";

export function UrlField({
  value,
  isEditing,
  isMasked,
  onChange,
}: FieldRendererProps): React.JSX.Element {
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  const handleOpenUrl = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (!value) return;

    let targetUrl = value;
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    openConfirm({
      title: "Open External Link?",
      description: `This will open your default web browser to visit: ${targetUrl}`,
      confirmLabel: "Open Link",
      cancelLabel: "Cancel",
      variant: "default",
      onConfirm: (): void => {
        void open(targetUrl);
      },
    });
  };

  if (!isEditing) {
    if (!value) return <p className="text-sm text-muted-foreground">—</p>;
    if (isMasked)
      return <p className="text-sm text-foreground">{"•".repeat(8)}</p>;

    return (
      <button
        type="button"
        onClick={handleOpenUrl}
        className="group flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="truncate">{value}</span>
        <ExternalLinkIcon className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
      </button>
    );
  }

  return (
    <input
      type={isMasked ? "password" : "url"}
      value={value}
      onChange={(e): void => {
        onChange(e.target.value);
      }}
      placeholder="https://example.com"
      autoComplete="off"
      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
