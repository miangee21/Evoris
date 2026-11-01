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

function extractErrorCode(error: unknown): string | undefined {
  if (typeof error === "string") {
    const trimmed = error.trim();
    if (trimmed === "") {
      return undefined;
    }
    // A JSON string is either an object with a `code` field or a
    // JSON-encoded plain code string (e.g. '"CORRUPTED_VAULT"').
    if (trimmed.startsWith("{")) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (parsed !== null && typeof parsed === "object" && "code" in parsed) {
          const code = parsed.code;
          if (typeof code === "string") {
            return code;
          }
        }
      } catch {
        // Malformed JSON: fall through and keep the raw string below.
      }
      return trimmed;
    }
    if (trimmed.startsWith('"')) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (typeof parsed === "string" && parsed !== "") {
          return parsed;
        }
      } catch {
        // Malformed JSON: fall through and keep the raw string below.
      }
    }
    return trimmed;
  }
  if (error instanceof Error) {
    // An Error's message may itself be a code or a JSON error string.
    return extractErrorCode(error.message);
  }
  if (error !== null && typeof error === "object" && "code" in error) {
    const code = error.code;
    if (typeof code === "string" && code !== "") {
      return code;
    }
    return undefined;
  }
  return undefined;
}

export async function invokeCommand<TResult>(
  command: CommandName,
  payload: Record<string, unknown> | undefined,
  resultSchema: ZodType<TResult>,
): Promise<Result<TResult, EvorisError>> {
  try {
    const response = await invoke(command, payload);
    const parsed = resultSchema.safeParse(response);

    if (!parsed.success) {
      console.error(`[Zod Validation Error in ${command}]`, parsed.error);
      return err("CORRUPTED_VAULT");
    }

    return ok(parsed.data);
  } catch (error) {
    // Always log the full raw error so a user can paste it if the
    // mapped toast still does not explain the failure.
    console.error(`[Invoke Error in ${command}]`, error);
    const code = extractErrorCode(error);
    if (code !== undefined) {
      return err(code as EvorisError);
    }
    return err("UNKNOWN");
  }
}
