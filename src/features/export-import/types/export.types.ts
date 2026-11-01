//src/features/export-import/types/export.types.ts
import type { z } from "zod";
import type {
  exportPayloadSchema,
  importSummarySchema,
} from "../schemas/export-payload.schema";

export type ExportPayload = z.infer<typeof exportPayloadSchema>;
export type ImportSummary = z.infer<typeof importSummarySchema>;
