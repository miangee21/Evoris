//src/features/export-import/hooks/use-import-vault-file.ts
import { invokeCommand } from "@/shared/lib/invoke";
import { vaultDataSchema } from "@/shared/schemas/vault.schema";
import type { Result } from "@/shared/lib/result";
import type { EvorisError } from "@/shared/lib/errors";
import type { VaultData } from "@/shared/types/vault.types";
import { importSummarySchema } from "../schemas/export-payload.schema";
import type { ImportSummary } from "../types/export.types";

export async function readImportFileCmd(
  path: string,
): Promise<Result<ImportSummary, EvorisError>> {
  const result = await invokeCommand(
    "read_import_file",
    { path },
    importSummarySchema,
  );
  if (result.ok) {
    return result;
  }
  if (result.error === "CORRUPTED_VAULT" || result.error === "PARSE_ERROR") {
    return { ok: false, error: "INVALID_IMPORT_FORMAT" };
  }
  return result;
}

export async function createVaultFromImportCmd(
  path: string,
  importPath: string,
  newVaultName: string,
  password: string,
): Promise<Result<VaultData, EvorisError>> {
  const result = await invokeCommand(
    "create_vault_from_import",
    { path, importPath, newVaultName, password },
    vaultDataSchema,
  );
  if (result.ok) {
    return result;
  }
  if (result.error === "CORRUPTED_VAULT" || result.error === "PARSE_ERROR") {
    return { ok: false, error: "INVALID_IMPORT_FORMAT" };
  }
  return result;
}
