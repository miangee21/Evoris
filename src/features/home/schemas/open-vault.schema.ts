//src/features/home/schemas/open-vault.schema.ts
import { z } from "zod";

export const openVaultSchema = z.object({
  masterPassword: z.string().min(1, "Master password is required"),
});

export type OpenVaultFormValues = z.infer<typeof openVaultSchema>;
