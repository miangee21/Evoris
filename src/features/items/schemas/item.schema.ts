//src/features/items/schemas/item.schema.ts
import { z } from "zod";
import {
  ITEM_NAME_MAX_LENGTH,
  ITEM_NAME_MIN_LENGTH,
} from "@/shared/constants/limits";
import { fieldSchema } from "@/shared/schemas/vault.schema";

export const itemFormSchema = z.object({
  name: z
    .string()
    .min(
      ITEM_NAME_MIN_LENGTH,
      `Item name must be at least ${String(ITEM_NAME_MIN_LENGTH)} characters`,
    )
    .max(
      ITEM_NAME_MAX_LENGTH,
      `Item name cannot exceed ${String(ITEM_NAME_MAX_LENGTH)} characters`,
    ),
  category_id: z.string().nullable(),
  fields: z.array(fieldSchema),
});

export const itemSchema = itemFormSchema;

export type ItemFormValues = z.infer<typeof itemFormSchema>;
