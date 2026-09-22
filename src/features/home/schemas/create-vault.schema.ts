//src/features/home/schemas/create-vault.schema.ts
import { z } from "zod";
import { masterPasswordSchema } from "@/shared/schemas/master-password.schema";
import { VAULT_NAME_MAX_LENGTH } from "@/shared/constants/limits";

export const createVaultSchema = z
  .object({
    vaultName: z
      .string()
      .min(1, "Vault name is required")
      .max(
        VAULT_NAME_MAX_LENGTH,
        `Maximum ${String(VAULT_NAME_MAX_LENGTH)} characters allowed`,
      )
      .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers allowed"),
    masterPassword: masterPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.masterPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateVaultFormValues = z.infer<typeof createVaultSchema>;
