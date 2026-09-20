//src/shared/lib/invoke.ts
import { invoke } from "@tauri-apps/api/core";
import type { ZodType } from "zod";
import { ok, err, type Result } from "./result";
import type { EvorisError } from "./errors";

export type CommandName =
  | "create_vault"
  | "open_vault"
  | "lock_vault"
  | "unlock_vault"
  | "close_vault"
  | "get_vault_state"
  | "change_master_password"
  | "list_items"
  | "get_item"
  | "create_item"
  | "update_item"
  | "delete_item"
  | "list_categories"
  | "create_category"
  | "update_category"
  | "delete_category"
  | "list_trash"
  | "restore_item"
  | "delete_item_permanently"
  | "empty_trash"
  | "get_settings"
  | "update_settings"
  | "export_vault_json"
  | "read_import_file"
  | "create_vault_from_import";

export async function invokeCommand<TResult>(
  command: CommandName,
  payload: Record<string, unknown> | undefined,
  resultSchema: ZodType<TResult>,
): Promise<Result<TResult, EvorisError>> {
  try {
    const response = await invoke(command, payload);
    const parsed = resultSchema.safeParse(response);

    if (!parsed.success) {
      return err("CORRUPTED_VAULT");
    }

    return ok(parsed.data);
  } catch (error) {
    if (error !== null && typeof error === "object" && "code" in error) {
      const typedError = error as { code: EvorisError };
      if (typeof typedError.code === "string") {
        return err(typedError.code);
      }
    }
    return err("UNKNOWN");
  }
}
