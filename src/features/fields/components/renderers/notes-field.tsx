//src/features/fields/components/renderers/notes-field.tsx
import * as React from "react";
import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { ExternalLinkIcon } from "lucide-react";
import { open } from "@tauri-apps/plugin-shell";
import { useConfirmStore } from "@/shared/hooks/use-confirm";
import type { FieldRendererProps } from "./text-field";

function toExternalUrl(href: string | undefined): string | null {
  if (href === undefined) return null;
  const trimmed = href.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.startsWith("#")) return null;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function SafeMarkdown({
  value,
}: {
  readonly value: string;
}): React.JSX.Element {
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  const components: Components = {
    a: ({ href, children }): React.JSX.Element => {
      const targetUrl = toExternalUrl(href);
      if (targetUrl === null) {
        return <span>{children}</span>;
      }
      return (
        <button
          type="button"
          onClick={(): void => {
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
          }}
          className="inline-flex items-center gap-1 rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{children}</span>
          <ExternalLinkIcon className="size-3.5 opacity-70" />
        </button>
      );
    },
    // Images in notes are never rendered (no remote fetch, no tracking).
    img: (): null => null,
  };

  return <ReactMarkdown components={components}>{value}</ReactMarkdown>;
}

export function NotesField({
  value,
  isEditing,
  isMasked,
  onChange,
}: FieldRendererProps): React.JSX.Element {
  const [tab, setTab] = useState<"write" | "preview">("write");

  if (!isEditing) {
    if (!value) return <p className="text-sm text-muted-foreground">—</p>;
    if (isMasked)
      return <p className="text-sm text-foreground">{"•".repeat(12)}</p>;

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-word">
        <SafeMarkdown value={value} />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-input bg-transparent shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
      <div className="flex items-center gap-2 border-b border-input bg-muted/50 px-3 py-2">
        <button
          type="button"
          onClick={(): void => {
            setTab("write");
          }}
          className={`rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
            tab === "write"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={(): void => {
            setTab("preview");
          }}
          className={`rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
            tab === "preview"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="p-3">
        {tab === "write" ? (
          <textarea
            value={value}
            onChange={(e): void => {
              onChange(e.target.value);
            }}
            placeholder="Write your notes here... (Markdown supported)"
            autoComplete="off"
            spellCheck={false}
            className="min-h-30 w-full resize-y bg-transparent text-sm focus-visible:outline-none"
          />
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none min-h-30">
            {value ? (
              <SafeMarkdown value={value} />
            ) : (
              <p className="italic text-muted-foreground">Nothing to preview</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
