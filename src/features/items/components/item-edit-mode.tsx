//src/features/items/components/item-edit-mode.tsx
import * as React from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray, useWatch } from "react-hook-form";
import { FolderXIcon } from "lucide-react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { sortByName } from "@/shared/lib/sort";
import { getCategoryIcon } from "@/features/categories/lib/category-display";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select";
import { FieldList } from "@/features/fields/components/field-list";
import { AddFieldMenu } from "@/features/fields/components/add-field-menu";
import { useFieldReorder } from "@/features/fields/hooks/use-field-reorder";
import { PasswordGeneratorModal } from "@/features/password-generator/components/password-generator-modal";
import { fieldPath } from "@/features/fields/lib/field-path";
import { TotpSection } from "@/features/totp/components/totp-section";
import { AttachmentsSection } from "@/features/attachments/components/attachments-section";
import type { Attachment, TotpConfig } from "@/shared/types/vault.types";
import type { ItemFormValues } from "../schemas/item.schema";

interface ItemEditModeProps {
  readonly form: UseFormReturn<ItemFormValues>;
  readonly onSubmit: (data: ItemFormValues) => void | Promise<void>;
  /** Per-item 2FA state, owned by the page (not a form field). */
  readonly totp?: TotpConfig | null;
  readonly onTotpChange?: (totp: TotpConfig | null) => void;
  /** Per-item attachments, owned by the page (not a form field). */
  readonly attachments?: readonly Attachment[];
  readonly onAttachmentsChange?: (attachments: Attachment[]) => void;
  readonly isProcessing?: boolean;
}

export const ItemEditMode = React.memo(function ItemEditMode({
  form,
  onSubmit,
  totp,
  onTotpChange,
  attachments,
  onAttachmentsChange,
  isProcessing = false,
}: ItemEditModeProps): React.JSX.Element {
  const categories = useSessionStore((state) => state.categories);

  // Sort categories A-Z for the dropdown
  const sortedCategories = React.useMemo(() => {
    return sortByName(categories, (c) => c.name);
  }, [categories]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove, move } = useFieldArray<
    ItemFormValues,
    "fields",
    "fieldKey"
  >({
    control,
    name: "fields",
    keyName: "fieldKey",
  });

  const { moveUp, moveDown } = useFieldReorder(move);
  const selectedCategoryId = useWatch({ control, name: "category_id" });
  const selectedCategory = React.useMemo(() => {
    if (selectedCategoryId == null) return undefined;
    return categories.find((c) => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const SelectedCategoryIcon = selectedCategory
    ? getCategoryIcon(selectedCategory.icon)
    : null;

  const [generatorIndex, setGeneratorIndex] = useState<number | null>(null);

  return (
    <>
      <form
        id="item-edit-form"
        onSubmit={(e) => {
          // Safe submission wrapper
          void handleSubmit(onSubmit)(e);
        }}
        className="mx-auto flex w-full max-w-3xl flex-col gap-8 pt-8 animate-in fade-in duration-normal"
      >
        {/* Main Info Section */}
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Item Name Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Google Account, Wi-Fi Password"
              autoComplete="off"
              {...register("name")}
              className="h-10 px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="text-xs font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Category Selection Dropdown */}
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select
              value={selectedCategoryId ?? "uncategorized"}
              onValueChange={(val): void => {
                setValue("category_id", val === "uncategorized" ? null : val, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            >
              <SelectTrigger className="w-72 max-w-full">
                {SelectedCategoryIcon !== null &&
                selectedCategory !== undefined ? (
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <SelectedCategoryIcon
                      className="size-4 shrink-0"
                      style={{ color: selectedCategory.color }}
                    />
                    <span className="truncate">{selectedCategory.name}</span>
                  </span>
                ) : (
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <FolderXIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">Uncategorized</span>
                  </span>
                )}
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="uncategorized">
                  <div className="flex items-center gap-2">
                    <FolderXIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">Uncategorized</span>
                  </div>
                </SelectItem>

                {sortedCategories.length > 0 && (
                  <div className="my-1 h-px w-full shrink-0 bg-border" />
                )}

                {sortedCategories.map((cat) => {
                  const IconComp = getCategoryIcon(cat.icon);
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <IconComp
                          className="size-4 shrink-0"
                          style={{ color: cat.color }}
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Two-factor authentication: per-item, not a custom field. */}
        {onTotpChange !== undefined && (
          <TotpSection
            totp={totp ?? null}
            onTotpChange={onTotpChange}
            isProcessing={isProcessing}
          />
        )}

        {/* Attachments: per-item files inside the vault, not a field type. */}
        {onAttachmentsChange !== undefined && (
          <AttachmentsSection
            attachments={attachments ?? []}
            onAttachmentsChange={onAttachmentsChange}
            isProcessing={isProcessing}
          />
        )}

        {/* Dynamic Fields Engine */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-foreground px-1">
            Custom Fields
          </h3>

          {fields.length > 0 ? (
            <FieldList
              fields={fields}
              control={control}
              setValue={setValue}
              onRemove={(index): void => {
                remove(index);
              }}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              onMove={(fromIndex, toIndex): void => {
                move(fromIndex, toIndex);
              }}
              onGeneratePassword={(index): void => {
                setGeneratorIndex(index);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card py-12 text-center shadow-sm">
              <p className="text-sm font-medium text-foreground">
                No custom fields yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add passwords, notes, and other sensitive data below.
              </p>
            </div>
          )}

          <AddFieldMenu
            onAdd={(typeDef): void => {
              append({
                id: crypto.randomUUID(),
                type: typeDef.key,
                label: typeDef.label,
                value: "",
                masked: typeDef.defaultMasked,
                order: fields.length, // Renumbered densely on save
              });
            }}
          />
        </div>
      </form>

      <PasswordGeneratorModal
        isOpen={generatorIndex !== null}
        onClose={(): void => {
          setGeneratorIndex(null);
        }}
        onUsePassword={(password): void => {
          if (generatorIndex !== null) {
            setValue(fieldPath(generatorIndex, "value"), password, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
          setGeneratorIndex(null);
        }}
      />
    </>
  );
});
