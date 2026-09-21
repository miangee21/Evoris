//src/features/password-generator/types/generator.types.ts
export interface PasswordGeneratorOptions {
  readonly length: number;
  readonly uppercase: boolean;
  readonly lowercase: boolean;
  readonly numbers: boolean;
  readonly symbols: boolean;
  readonly excludeAmbiguous: boolean;
}
