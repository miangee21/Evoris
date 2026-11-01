//src/features/export-import/schemas/export-payload.schema.ts
import { z } from "zod";
import { categorySchema, itemSchema } from "@/shared/schemas/vault.schema";
import { EXPORT_FORMAT_VERSION } from "@/shared/constants/app.constants";

export const EXPORT_FORMAT = "evoris-export" as const;

export const exportPayloadSchema = z
  .object({
    format: z.literal(EXPORT_FORMAT),
    formatVersion: z.literal(EXPORT_FORMAT_VERSION),
    exportedAt: z.string().min(1),
    vaultName: z.string().min(1),
    categories: z.array(categorySchema),
    items: z.array(itemSchema),
    trash: z.array(itemSchema),
  })
  .superRefine((data, ctx) => {
    data.items.forEach((item, index) => {
      if (item.in_trash || item.deleted_at !== null) {
        ctx.addIssue({
          code: "custom",
          message: "Live items must not be trashed or carry deleted_at.",
          path: ["items", index],
        });
      }
    });
    data.trash.forEach((item, index) => {
      if (!item.in_trash || item.deleted_at === null) {
        ctx.addIssue({
          code: "custom",
          message: "Trash items must be trashed and carry deleted_at.",
          path: ["trash", index],
        });
      }
    });
    const categoryIds = new Set(data.categories.map((c) => c.id));
    [...data.items, ...data.trash].forEach((item) => {
      if (item.category_id !== null && !categoryIds.has(item.category_id)) {
        ctx.addIssue({
          code: "custom",
          message: "Item references a non-existent category.",
          path: ["items"],
        });
      }
    });
  });

export const importSummarySchema = z.object({
  vaultName: z.string(),
  itemCount: z.number().int().min(0),
  categoryCount: z.number().int().min(0),
  trashCount: z.number().int().min(0),
});
