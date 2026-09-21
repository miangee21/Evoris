//src/features/home/schemas/create-vault.schema.ts
import { z } from "zod";
import { masterPasswordSchema } from "@/shared/schemas/master-password.schema";

export const createVaultSchema = z
  .object({
    vaultName: z
      .string()
      .min(1, "Vault name is required")
      .max(15, "Maximum 15 characters allowed")
      .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers allowed"),
    masterPassword: masterPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.masterPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateVaultFormValues = z.infer<typeof createVaultSchema>;
