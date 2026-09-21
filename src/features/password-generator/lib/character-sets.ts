//src/features/password-generator/lib/character-sets.ts
export const CHAR_SETS = {
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  NUMBERS: "0123456789",
  SYMBOLS: "!@#$%^&*()_+-=[]{}|;:,.<>/?~",
} as const;

// Characters that look alike and can cause confusion when reading
export const AMBIGUOUS_CHARS = "0OolI1|";
