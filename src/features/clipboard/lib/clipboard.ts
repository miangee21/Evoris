//src/features/clipboard/lib/clipboard.ts
import { writeText, clear } from "@tauri-apps/plugin-clipboard-manager";

export async function copyToClipboard(value: string): Promise<void> {
  await writeText(value);
}

export async function clearClipboard(): Promise<void> {
  try {
    await clear();
  } catch {
    // Fallback if the OS doesn't support the native clear command
    await writeText("");
  }
}
