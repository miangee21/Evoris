//src/features/items/components/item-view-mode.tsx
import * as React from "react";
import { FolderOpenIcon } from "lucide-react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import {
  categoryBadgeStyle,
  getCategoryIcon,
} from "@/features/categories/lib/category-display";
import { FieldRow } from "@/features/fields/components/field-row";
import type { FieldValues } from "@/features/fields/schemas/field.schema";
import { TotpSection } from "@/features/totp/components/totp-section";
import { TotpBadge } from "@/features/totp/components/totp-badge";
import { AttachmentsSection } from "@/features/attachments/components/attachments-section";
import type { Attachment, Item, TotpConfig } from "@/shared/types/vault.types";

interface ItemViewModeProps {
  readonly item: Item;
  readonly onTotpChange?: (totp: TotpConfig | null) => void;
  readonly attachments?: readonly Attachment[];
  readonly isProcessing?: boolean;
}

export function ItemViewMode({
  item,
  onTotpChange,
  attachments,
  isProcessing = false,
}: ItemViewModeProps): React.JSX.Element {
  const categories = useSessionStore((state) => state.categories);
  const category = categories.find((c) => c.id === item.category_id);

  const IconComponent = category
    ? getCategoryIcon(category.icon)
    : FolderOpenIcon;
  const badgeStyle = categoryBadgeStyle(category?.color);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pt-8 animate-in fade-in duration-normal">
      {/* Top Section: Category Badge & Title */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-xl shadow-sm transition-colors"
            style={badgeStyle}
          >
            <IconComponent className="size-5" />
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold shadow-sm"
            style={badgeStyle}
          >
            {category ? category.name : "Uncategorized"}
          </span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {item.name}
        </h2>
      </div>

      {/* Dynamic Fields Engine */}
      {item.fields.length > 0 && (
        <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
          {[...item.fields]
            // Ensure fields are sorted by order before displaying
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <FieldRow
                key={field.id}
                field={field as FieldValues}
                index={index}
                totalFields={item.fields.length}
                isEditing={false}
                // View mode doesn't trigger these, but TS requires them
                onUpdate={(): void => undefined}
                onDelete={(): void => undefined}
                onMoveUp={(): void => undefined}
                onMoveDown={(): void => undefined}
              />
            ))}
        </div>
      )}

      {/* Attachments: read-only list with download + image preview. */}
      <AttachmentsSection attachments={attachments ?? item.attachments} />

      {onTotpChange !== undefined ? (
        <TotpSection
          totp={item.totp}
          onTotpChange={onTotpChange}
          isProcessing={isProcessing}
        />
      ) : (
        item.totp !== null && (
          <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
            <TotpBadge secret={item.totp.secret} />
          </div>
        )
      )}
    </div>
  );
}
