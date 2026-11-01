//src/features/items/components/item-create-page.tsx
import * as React from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/shared/components/page-container";
import { ItemDetailHeader } from "./item-detail-header";
import { ItemEditMode } from "./item-edit-mode";
import { itemSchema, type ItemFormValues } from "../schemas/item.schema";
import { useItemMutations } from "../hooks/use-item-mutations";
import { useConfirmStore } from "@/shared/hooks/use-confirm";
import { renumberFields } from "@/features/fields/lib/renumber-fields";
import type { Attachment, Item, TotpConfig } from "@/shared/types/vault.types";

function CreatePageHeader({
  form,
  isProcessing,
  onBackOrCancel,
}: {
  readonly form: UseFormReturn<ItemFormValues>;
  readonly isProcessing: boolean;
  readonly onBackOrCancel: () => void;
}): React.JSX.Element {
  const itemName = useWatch({ control: form.control, name: "name" });
  return (
    <ItemDetailHeader
      isEditing={true}
      isProcessing={isProcessing}
      itemName={itemName}
      isCreateMode={true}
      submitLabel="Create"
      onBack={onBackOrCancel}
      onCancel={onBackOrCancel}
      onEdit={(): void => undefined} // Not used in create mode
      onDelete={(): void => undefined} // Not used in create mode
    />
  );
}

export function ItemCreatePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { createItem, isProcessing } = useItemMutations();
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  const [totp, setTotp] = React.useState<TotpConfig | null>(null);
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      category_id: null,
      fields: [],
    },
  });

  const isDirty =
    form.formState.isDirty || totp !== null || attachments.length > 0;

  const handleBackOrCancel = useCallback((): void => {
    if (isDirty) {
      openConfirm({
        title: "Discard changes?",
        description:
          "You have unsaved changes. Are you sure you want to discard them?",
        confirmLabel: "Discard",
        cancelLabel: "Cancel",
        variant: "destructive",
        onConfirm: (): void => {
          void navigate("/vault");
        },
      });
    } else {
      void navigate("/vault");
    }
  }, [isDirty, navigate, openConfirm]);

  const onSubmit = useCallback(
    async (data: ItemFormValues): Promise<void> => {
      const newItem: Item = {
        id: crypto.randomUUID(),
        category_id: data.category_id,
        name: data.name.trim(),
        // Submit the form fields, renumbered densely 0..n-1 in order.
        fields: renumberFields(data.fields),
        // Per-item 2FA from the TotpSection in edit mode (not a field).
        totp,
        attachments,
        created_at: "",
        updated_at: "",
        is_favorite: false,
        in_trash: false,
        deleted_at: null,
      };

      const success = await createItem(newItem);
      if (success) {
        void navigate(`/vault/${newItem.id}`);
      }
    },
    [createItem, navigate, totp, attachments],
  );

  return (
    <PageContainer className="bg-background">
      <CreatePageHeader
        form={form}
        isProcessing={isProcessing}
        onBackOrCancel={handleBackOrCancel}
      />

      <div className="w-full px-6 pb-24 sm:px-10">
        <ItemEditMode
          form={form}
          onSubmit={onSubmit}
          totp={totp}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onTotpChange={setTotp}
          isProcessing={isProcessing}
        />
      </div>
    </PageContainer>
  );
}
