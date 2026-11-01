//src/features/fields/schemas/field.schema.ts
import type { z } from "zod";
import type { fieldSchema } from "@/shared/schemas/vault.schema";

export { fieldSchema, fieldTypeSchema } from "@/shared/schemas/vault.schema";
export type FieldValues = z.infer<typeof fieldSchema>;
