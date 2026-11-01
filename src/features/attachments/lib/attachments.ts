//src/features/attachments/lib/attachments.ts
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { documentDir } from "@tauri-apps/api/path";
import {
  ATTACHMENT_MAX_COUNT,
  ATTACHMENT_MAX_SIZE_BYTES,
} from "@/shared/constants/limits";
import type { Attachment } from "@/shared/types/vault.types";

export const DOWNLOAD_MIME_FALLBACK = "application/octet-stream";

export function isImageAttachment(attachment: Attachment): boolean {
  return attachment.mime_type.startsWith("image/");
}

/** Chunked conversion: never String.fromCharCode.apply on a whole buffer. */
export function bytesToBase64(bytes: Uint8Array): string {
  const CHUNK_SIZE = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(binary);
}

export function base64ToBytes(dataBase64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(dataBase64);
  const bytes: Uint8Array<ArrayBuffer> = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function formatAttachmentSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${String(sizeBytes)} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Unix-seconds string (Rust convention) -> locale date, or null when unset. */
export function formatAttachmentDate(createdAt: string): string | null {
  if (createdAt === "") return null;
  const seconds = Number(createdAt);
  if (!Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toLocaleString();
}

export interface AddFilesResult {
  readonly attachments: Attachment[];
  readonly errors: string[];
}

export async function filesToAttachments(
  current: readonly Attachment[],
  files: readonly File[],
): Promise<AddFilesResult> {
  const accepted: Attachment[] = [];
  const errors: string[] = [];
  for (const file of files) {
    if (current.length + accepted.length >= ATTACHMENT_MAX_COUNT) {
      errors.push(
        `"${file.name}" was not added: an item can hold up to ${String(ATTACHMENT_MAX_COUNT)} files.`,
      );
      continue;
    }
    if (file.size > ATTACHMENT_MAX_SIZE_BYTES) {
      errors.push(
        `"${file.name}" was not added: it exceeds the 5 MB per-file limit.`,
      );
      continue;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    accepted.push({
      id: crypto.randomUUID(),
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      data_base64: bytesToBase64(bytes),
      created_at: "",
    });
  }
  return { attachments: [...current, ...accepted], errors };
}

export async function downloadAttachment(
  attachment: Attachment,
): Promise<void> {
  const docsPath = await documentDir();
  const selectedPath = await save({
    defaultPath: `${docsPath}/${attachment.file_name}`,
  });
  if (!selectedPath) return;
  await writeFile(selectedPath, base64ToBytes(attachment.data_base64));
}

/** In-memory blob URL for image preview; the caller must revoke it. */
export function previewUrlFor(attachment: Attachment): string {
  const blob = new Blob([base64ToBytes(attachment.data_base64)], {
    type: attachment.mime_type || DOWNLOAD_MIME_FALLBACK,
  });
  return URL.createObjectURL(blob);
}
