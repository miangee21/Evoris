//src/features/items/components/item-detail-page.tsx
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/shared/components/page-container";
import { ItemDetailHeader } from "./item-detail-header";
import { ItemViewMode } from "./item-view-mode";
import { ItemEditMode } from "./item-edit-mode";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { itemSchema, type ItemFormValues } from "../schemas/item.schema";
import { useItemMutations } from "../hooks/use-item-mutations";
import { useConfirmStore } from "@/shared/hooks/use-confirm";
import { renumberFields } from "@/features/fields/lib/renumber-fields";
import type { Attachment, Item, TotpConfig } from "@/shared/types/vault.types";

function DetailPageHeader({
  form,
  isEditing,
  isProcessing,
  fallbackName,
  onBack,
  onCancel,
  onEdit,
  onDelete,
}: {
  readonly form: UseFormReturn<ItemFormValues>;
  readonly isEditing: boolean;
  readonly isProcessing: boolean;
  readonly fallbackName: string;
  readonly onBack: () => void;
  readonly onCancel: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}): React.JSX.Element {
  const watchedName = useWatch({ control: form.control, name: "name" });
  return (
    <ItemDetailHeader
      isEditing={isEditing}
      isProcessing={isProcessing}
      itemName={isEditing ? watchedName : fallbackName}
      onBack={onBack}
      onEdit={onEdit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  );
}

export function ItemDetailPage(): React.JSX.Element | null {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const items = useSessionStore((state) => state.items);
  // URL Guard: Find the item or undefined
  const item = items.find((i) => i.id === itemId);

  const { updateItem, deleteItem, isProcessing } = useItemMutations();
  const openConfirm = useConfirmStore((state) => state.openConfirm);

  // Initialize edit mode based on URL query (?edit=true)
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true",
  );

  const [totp, setTotp] = useState<TotpConfig | null>(item?.totp ?? null);
  const [attachments, setAttachments] = useState<Attachment[]>([
    ...(item?.attachments ?? []),
  ]);

  // Hook Form for editing
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item?.name ?? "",
      category_id: item?.category_id ?? null,
      fields: item?.fields ? [...item.fields] : [],
    },
  });

  // Invalid URL Guard - redirect if item doesn't exist
  useEffect(() => {
    if (!item) {
      void navigate("/vault", { replace: true });
    }
  }, [item, navigate]);

  // Sync form values if item data changes (or resets on cancel)
  useEffect(() => {
    if (item && !isEditing) {
      form.reset({
        name: item.name,
        category_id: item.category_id,
        fields: [...item.fields], // Sync fields as well
      });
      setTotp(item.totp);
      setAttachments([...item.attachments]);
    }
  }, [item, isEditing, form]);

  // Defined before the early return below: hooks must run unconditionally.
  const onSubmit = useCallback(
    async (data: ItemFormValues): Promise<void> => {
      if (item === undefined) return;

      const updatedItem: Item = {
        ...item,
        name: data.name.trim(),
        category_id: data.category_id,
        fields: renumberFields(data.fields),
        totp,
        attachments,
        // Rust commands::now() overwrites updated_at on update.
        updated_at: "",
      };

      const success = await updateItem(updatedItem);
      if (success) {
        setIsEditing(false);
        setSearchParams({});
      }
    },
    [item, setSearchParams, updateItem, totp, attachments],
  );

  // View-mode 2FA change: persisted immediately (unlike edit mode,
  // where it is pending until Save).
  const handleViewTotpChange = useCallback(
    (nextTotp: TotpConfig | null): void => {
      if (item === undefined) return;
      void updateItem({ ...item, totp: nextTotp, updated_at: "" });
    },
    [item, updateItem],
  );

  if (!item) return null; // Prevent rendering while redirecting

  const attachmentsHaveChanged =
    attachments.length !== item.attachments.length ||
    attachments.some((a, i) => a.id !== item.attachments[i]?.id);

  const isDirty =
    form.formState.isDirty ||
    totp?.secret !== item.totp?.secret ||
    attachmentsHaveChanged;

  const handleBack = (): void => {
    if (isEditing && isDirty) {
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
  };

  const handleCancelEdit = (): void => {
    if (isDirty) {
      openConfirm({
        title: "Discard changes?",
        description:
          "You have unsaved changes. Are you sure you want to discard them?",
        confirmLabel: "Discard",
        cancelLabel: "Cancel",
        variant: "destructive",
        onConfirm: () => {
          form.reset();
          setTotp(item.totp);
          setAttachments([...item.attachments]);
          setIsEditing(false);
          setSearchParams({});
        },
      });
    } else {
      setTotp(item.totp);
      setAttachments([...item.attachments]);
      setIsEditing(false);
      setSearchParams({});
    }
  };

  const handleDelete = (): void => {
    openConfirm({
      title: "Move to Trash?",
      description: `Are you sure you want to move "${item.name}" to the trash? You can restore it later.`,
      confirmLabel: "Move to Trash",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async (): Promise<void> => {
        const success = await deleteItem(item.id);
        if (success) {
          void navigate("/vault");
        }
      },
    });
  };

  return (
    <PageContainer className="bg-background">
      <DetailPageHeader
        form={form}
        isEditing={isEditing}
        isProcessing={isProcessing}
        fallbackName={item.name}
        onBack={handleBack}
        onCancel={handleCancelEdit}
        onEdit={(): void => {
          setIsEditing(true);
        }}
        onDelete={handleDelete}
      />

      <div className="w-full px-6 pb-24 sm:px-10">
        {isEditing ? (
          <ItemEditMode
            form={form}
            onSubmit={onSubmit}
            totp={totp}
            onTotpChange={setTotp}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            isProcessing={isProcessing}
          />
        ) : (
          <ItemViewMode
            item={item}
            onTotpChange={handleViewTotpChange}
            attachments={attachments}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </PageContainer>
  );
}
