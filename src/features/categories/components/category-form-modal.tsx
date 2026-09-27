//src/features/categories/components/category-form-modal.tsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { CategoryCard } from "./category-card";
import { CategoryIconPicker } from "./category-icon-picker";
import { CategoryColorPicker } from "./category-color-picker";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "../schemas/category.schema";
import type { CategoryModalState } from "../types/category.types";
import type { Category } from "@/shared/types/vault.types";

interface CategoryFormModalProps {
  readonly state: CategoryModalState;
  readonly onClose: () => void;
  readonly onSubmit: (data: Category) => Promise<boolean>;
  readonly isProcessing: boolean;
}

export function CategoryFormModal({
  state,
  onClose,
  onSubmit,
  isProcessing,
}: CategoryFormModalProps): React.JSX.Element {
  const isEdit = state.mode === "edit";

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      icon: "folder",
      color: "#8b5cf6",
    },
  });

  // Reset form when modal opens with new data
  useEffect(() => {
    if (state.isOpen) {
      reset({
        name: state.defaultValues?.name ?? "",
        icon: state.defaultValues?.icon ?? "folder",
        color: state.defaultValues?.color ?? "#8b5cf6",
      });
    }
  }, [state.isOpen, state.defaultValues, reset]);

  // Watch values for Live Preview
  const previewName = watch("name");
  const previewIcon = watch("icon");
  const previewColor = watch("color");

  const previewCategory: Category = {
    id: state.defaultValues?.id ?? "preview-id",
    name: previewName,
    icon: previewIcon,
    color: previewColor,
    created_at: state.defaultValues?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const handleFormSubmit = async (data: CategoryFormValues): Promise<void> => {
    const finalCategory: Category = {
      id: state.defaultValues?.id ?? crypto.randomUUID(),
      name: data.name,
      icon: data.icon,
      color: data.color,
      created_at: state.defaultValues?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await onSubmit(finalCategory);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog
      open={state.isOpen}
      onOpenChange={(open): void => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[95vw]! max-w-4xl! gap-0 p-0 overflow-hidden bg-background">
        <div className="grid grid-cols-[1fr_220px] sm:grid-cols-[1fr_260px] md:grid-cols-[1fr_300px]">
          {/* Left Column: Form Controls */}
          <div className="flex flex-col p-6 border-r border-border/50">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-xl">
                {isEdit ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>

            <form
              id="category-form"
              onSubmit={(e): void => {
                void handleSubmit(handleFormSubmit)(e);
              }}
              className="flex flex-col gap-6"
            >
              {/* Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Category Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Finance, Social, Work..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select Icon
                </label>
                <Controller
                  control={control}
                  name="icon"
                  render={({ field }): React.JSX.Element => (
                    <CategoryIconPicker
                      selectedIcon={field.value}
                      selectedColor={previewColor}
                      onSelect={field.onChange}
                    />
                  )}
                />
              </div>
            </form>
          </div>

          {/* Right Column: Color Picker & Live Preview */}
          <div className="flex flex-col justify-between bg-muted/20 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Theme Color
                </label>
                <Controller
                  control={control}
                  name="color"
                  render={({ field }): React.JSX.Element => (
                    <CategoryColorPicker
                      color={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <label className="text-sm font-medium text-muted-foreground">
                  Live Preview
                </label>
                <div className="pointer-events-none">
                  <CategoryCard
                    category={previewCategory}
                    itemCount={0}
                    isPreview={true}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="category-form"
                disabled={isProcessing}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 min-w-25"
              >
                {isProcessing ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
