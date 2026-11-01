//src/shared/schemas/vault.schema.ts
import { z } from "zod";
import {
  CATEGORY_NAME_MAX_LENGTH,
  FIELD_LABEL_MAX_LENGTH,
  ITEM_NAME_MIN_LENGTH,
  ITEM_NAME_MAX_LENGTH,
} from "../constants/limits";

export const fieldTypeSchema = z.enum([
  "text",
  "password",
  "email",
  "url",
  "notes",
  "heading",
]);

export const fieldSchema = z.object({
  id: z.string(),
  type: fieldTypeSchema,
  label: z.string().max(FIELD_LABEL_MAX_LENGTH),
  value: z.string(),
  masked: z.boolean(),
  order: z.number().int().min(0),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(CATEGORY_NAME_MAX_LENGTH),
  icon: z.string(),
  color: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const totpConfigSchema = z.object({
  secret: z.string(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  file_name: z.string(),
  mime_type: z.string(),
  size_bytes: z.number().int().min(0),
  data_base64: z.string(),
  created_at: z.string(),
});

export const itemSchema = z.object({
  id: z.string(),
  category_id: z.string().nullable(),
  name: z.string().min(ITEM_NAME_MIN_LENGTH).max(ITEM_NAME_MAX_LENGTH),
  fields: z.array(fieldSchema),
  totp: totpConfigSchema.nullable(),
  // Default so old stored items without the field still validate.
  attachments: z.array(attachmentSchema).default([]),
  created_at: z.string(),
  updated_at: z.string(),
  is_favorite: z.boolean(),
  in_trash: z.boolean(),
  deleted_at: z.string().nullable(),
});

export const vaultConfigSchema = z.object({
  navigation_mode: z.enum(["both", "top-bar-only", "dock-only"]),
  auto_lock_enabled: z.boolean(),
  lock_timeout_seconds: z.number().int().min(0),
});

export const vaultDataSchema = z
  .object({
    version: z.number(),
    settings: vaultConfigSchema,
    categories: z.array(categorySchema),
    items: z.array(itemSchema),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .superRefine((data, ctx) => {
    const validCategoryIds = new Set(data.categories.map((c) => c.id));

    data.items.forEach((item, index) => {
      if (
        item.category_id !== null &&
        !validCategoryIds.has(item.category_id)
      ) {
        ctx.addIssue({
          code: "custom",
          message: `Item references a non-existent category: ${item.category_id}`,
          path: ["items", index, "category_id"],
        });
      }
    });
  });
