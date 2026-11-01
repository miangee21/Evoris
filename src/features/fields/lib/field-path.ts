//src/features/fields/lib/field-path.ts
export type FieldKey = "label" | "value" | "masked";

export function fieldPath<K extends FieldKey>(
  index: number,
  key: K,
): `fields.${number}.${K}` {
  return ["fields", String(index), key].join(".") as `fields.${number}.${K}`;
}
