//src/features/items/components/item-card.tsx
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheckIcon, FolderOpen } from "lucide-react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import {
  CATEGORY_ICONS,
  FALLBACK_ICON,
} from "@/features/categories/constants/category-icons";
import type { Item } from "@/shared/types/vault.types";

interface ItemCardProps {
  readonly item: Item;
}

export function ItemCard({ item }: ItemCardProps): React.JSX.Element {
  const categories = useSessionStore((state) => state.categories);
  const category = categories.find((c) => c.id === item.category_id);
  const navigate = useNavigate();

  const IconComponent = category
    ? (CATEGORY_ICONS[category.icon] ?? FALLBACK_ICON)
    : FolderOpen;

  const catColor = category ? category.color : "var(--color-primary)";
  const bgOpacity = `color-mix(in srgb, ${catColor} 12%, transparent)`;

  return (
    <Link
      to={`/vault/${item.id}`}
      className="group flex min-h-42.5 flex-col justify-between rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Top Row: Squircle Icon & Category Pill */}
      <div className="flex items-start justify-between">
        <div
          className="flex size-12 items-center justify-center rounded-2xl transition-colors"
          style={{ backgroundColor: bgOpacity, color: catColor }}
        >
          <IconComponent className="size-6" />
        </div>

        <div className="flex items-center gap-2">
          {item.totp !== null && (
            <div title="2FA Enabled" className="flex items-center">
              <ShieldCheckIcon className="size-4 text-success" />
            </div>
          )}
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: bgOpacity, color: catColor }}
          >
            {category ? category.name : "Uncategorized"}
          </span>
        </div>
      </div>

      {/* Middle Content: Title Only */}
      <div className="mt-4">
        <h2 className="line-clamp-1 text-lg font-bold tracking-tight text-card-foreground">
          {item.name}
        </h2>
      </div>

      {/* Bottom Actions: Date & Edit/Delete Buttons */}
      <div className="mb-2 mt-auto flex items-center justify-between">
        <p className="text-sm font-normal text-muted-foreground">
          {`Updated ${new Date(
            isNaN(Number(item.updated_at))
              ? item.updated_at
              : Number(item.updated_at) * 1000,
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`}
        </p>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-1 text-muted-foreground transition-colors hover:text-foreground"
            title="Edit"
            onClick={(e) => {
              e.preventDefault();
              void navigate(`/vault/${item.id}?edit=true`);
            }}
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-1 text-muted-foreground transition-colors hover:text-destructive"
            title="Delete"
            onClick={(e) => {
              e.preventDefault();
              alert("Delete step 13 mein aayega");
            }}
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
