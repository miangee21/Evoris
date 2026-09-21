//src/features/password-generator/lib/generate-password.ts
import { CHAR_SETS, AMBIGUOUS_CHARS } from "./character-sets";
import type { PasswordGeneratorOptions } from "../types/generator.types";

/**
 * Generates a cryptographically secure random integer between 0 and max (exclusive)
 * Uses rejection sampling to completely avoid modulo bias.
 */
function getSecureRandomInt(max: number): number {
  const maxAllowed = 4294967295 - (4294967295 % max); // 2^32 - 1
  const randomBuffer = new Uint32Array(1);
  let randomValue: number;

  do {
    crypto.getRandomValues(randomBuffer);
    randomValue = randomBuffer[0] ?? 0;
  } while (randomValue >= maxAllowed);

  return randomValue % max;
}

/**
 * Shuffles a string using the cryptographically secure Fisher-Yates algorithm.
 */
function shuffleString(str: string): string {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const charI = arr[i] ?? "";
    const charJ = arr[j] ?? "";
    arr[i] = charJ;
    arr[j] = charI;
  }
  return arr.join("");
}

/**
 * Removes ambiguous characters from a given string.
 */
function stripAmbiguous(charSet: string): string {
  return charSet
    .split("")
    .filter((char) => !AMBIGUOUS_CHARS.includes(char))
    .join("");
}

/**
 * The main password generation algorithm.
 */
export function generatePassword(options: PasswordGeneratorOptions): string {
  const { length, uppercase, lowercase, numbers, symbols, excludeAmbiguous } =
    options;

  let pool = "";
  const guaranteedChars: string[] = [];

  const addPool = (chars: string): void => {
    const cleanChars = excludeAmbiguous ? stripAmbiguous(chars) : chars;
    if (cleanChars.length > 0) {
      pool += cleanChars;
      // Guarantee at least one character from each selected class
      guaranteedChars.push(
        cleanChars.charAt(getSecureRandomInt(cleanChars.length)),
      );
    }
  };

  if (uppercase) addPool(CHAR_SETS.UPPERCASE);
  if (lowercase) addPool(CHAR_SETS.LOWERCASE);
  if (numbers) addPool(CHAR_SETS.NUMBERS);
  if (symbols) addPool(CHAR_SETS.SYMBOLS);

  // If all toggles are disabled, return empty string (UI should handle this)
  if (pool.length === 0 || length < guaranteedChars.length) {
    return "";
  }

  // Start with our guaranteed characters
  let result = guaranteedChars.join("");

  // Fill the remaining length with random characters from the combined pool
  const remainingLength = length - result.length;
  for (let i = 0; i < remainingLength; i++) {
    result += pool.charAt(getSecureRandomInt(pool.length));
  }

  // Shuffle the final string so the guaranteed characters aren't always at the beginning
  return shuffleString(result);
}
