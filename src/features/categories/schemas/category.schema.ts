//src/features/categories/schemas/category.schema.ts
import { z } from "zod";
import { CATEGORY_NAME_MAX_LENGTH } from "@/shared/constants/limits";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(
      CATEGORY_NAME_MAX_LENGTH,
      `Maximum ${String(CATEGORY_NAME_MAX_LENGTH)} characters allowed`,
    ),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
