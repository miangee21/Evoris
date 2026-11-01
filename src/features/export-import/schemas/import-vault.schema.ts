//src/features/export-import/schemas/import-vault.schema.ts
import { z } from "zod";
import { masterPasswordSchema } from "@/shared/schemas/master-password.schema";
import { VAULT_NAME_MAX_LENGTH } from "@/shared/constants/limits";

export const importVaultSchema = z.object({
  vaultName: z
    .string()
    .min(1, "Vault name is required")
    .max(
      VAULT_NAME_MAX_LENGTH,
      `Maximum ${String(VAULT_NAME_MAX_LENGTH)} characters allowed`,
    )
    .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers allowed"),
  masterPassword: masterPasswordSchema,
});

export type ImportVaultFormValues = z.infer<typeof importVaultSchema>;
