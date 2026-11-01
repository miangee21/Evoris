//src/features/totp/schemas/totp.schema.ts
import { z } from "zod";
import { totpConfigSchema } from "@/shared/schemas/vault.schema";
import { isValidBase32 } from "../lib/base32";

export { totpConfigSchema };

export const totpSecretSchema = z
  .string()
  .refine((value) => isValidBase32(value), {
    message: "Enter a valid Base32 secret (letters A-Z and digits 2-7).",
  });

/** Form shape for the add/edit TOTP dialogs (one secret field only). */
export const totpSecretFormSchema = z.object({
  secret: totpSecretSchema,
});

export type TotpSecretFormInput = z.infer<typeof totpSecretFormSchema>;
