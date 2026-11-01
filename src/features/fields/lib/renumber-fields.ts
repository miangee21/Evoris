//src/features/fields/lib/renumber-fields.ts
import type { Field } from "@/shared/types/vault.types";
import type { FieldValues } from "../schemas/field.schema";

export function renumberFields(fields: readonly FieldValues[]): Field[] {
  return fields.map((field, index) => ({
    id: field.id,
    type: field.type,
    label: field.label,
    value: field.value,
    masked: field.masked,
    order: index,
  }));
}
