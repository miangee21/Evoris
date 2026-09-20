//src/shared/lib/id.ts
export function createId(): string {
  return crypto.randomUUID();
}
