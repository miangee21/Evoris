//src/features/theme/constants/accents.ts
export const ACCENT_KEYS = [
  "violet",
  "blue",
  "emerald",
  "amber",
  "rose",
  "cyan",
] as const;

export type AccentKey = (typeof ACCENT_KEYS)[number];
