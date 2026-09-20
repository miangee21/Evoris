//src/features/vault-session/api/vault.commands.ts
import { invokeCommand } from "@/shared/lib/invoke";
import { z } from "zod";
import { vaultDataSchema } from "@/shared/schemas/vault.schema";
import type { Result } from "@/shared/lib/result";
import type { EvorisError } from "@/shared/lib/errors";
import type { VaultData } from "@/shared/types/vault.types";

const vaultStateResponseSchema = z.object({
  is_unlocked: z.boolean(),
  vault_name: z.string().nullable(),
  file_name: z.string().nullable(),
});

export type VaultStateResponse = z.infer<typeof vaultStateResponseSchema>;

export async function openVaultCmd(
  path: string,
  password: string,
): Promise<Result<VaultData, EvorisError>> {
  return invokeCommand("open_vault", { path, password }, vaultDataSchema);
}

export async function createVaultCmd(
  path: string,
  password: string,
): Promise<Result<VaultData, EvorisError>> {
  return invokeCommand("create_vault", { path, password }, vaultDataSchema);
}

export async function lockVaultCmd(): Promise<Result<null, EvorisError>> {
  return invokeCommand("lock_vault", undefined, z.null());
}

export async function unlockVaultCmd(
  password: string,
): Promise<Result<VaultData, EvorisError>> {
  return invokeCommand("unlock_vault", { password }, vaultDataSchema);
}

export async function closeVaultCmd(): Promise<Result<null, EvorisError>> {
  return invokeCommand("close_vault", undefined, z.null());
}

export async function getVaultStateCmd(): Promise<
  Result<VaultStateResponse, EvorisError>
> {
  return invokeCommand("get_vault_state", undefined, vaultStateResponseSchema);
}
