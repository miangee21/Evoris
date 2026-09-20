//src/shared/schemas/vault.schema.ts
import { z } from "zod";
import {
  CATEGORY_NAME_MAX_LENGTH,
  FIELD_LABEL_MAX_LENGTH,
} from "../constants/limits";

export const fieldTypeSchema = z.enum([
  "text",
  "password",
  "email",
  "url",
  "totp",
  "notes",
  "heading",
]);

export const fieldSchema = z.object({
  id: z.string(),
  type: fieldTypeSchema,
  label: z.string().max(FIELD_LABEL_MAX_LENGTH),
  value: z.string(),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(CATEGORY_NAME_MAX_LENGTH),
  icon: z.string(),
  color: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const itemSchema = z.object({
  id: z.string(),
  category_id: z.string(),
  name: z.string().min(1),
  fields: z.array(fieldSchema),
  created_at: z.number(),
  updated_at: z.number(),
  is_favorite: z.boolean(),
  in_trash: z.boolean(),
});

export const vaultConfigSchema = z.object({
  lock_timeout_minutes: z.number().min(0),
});

export const vaultDataSchema = z.object({
  categories: z.array(categorySchema),
  items: z.array(itemSchema),
});

export const vaultStateSchema = z.object({
  is_locked: z.boolean(),
  has_vault: z.boolean(),
});
