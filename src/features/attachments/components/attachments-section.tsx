//src/features/attachments/components/attachments-section.tsx
import * as React from "react";
import {
  DownloadIcon,
  EyeIcon,
  FileIcon,
  ImageIcon,
  PaperclipIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Attachment } from "@/shared/types/vault.types";
import {
  downloadAttachment,
  filesToAttachments,
  formatAttachmentDate,
  formatAttachmentSize,
  isImageAttachment,
  previewUrlFor,
} from "../lib/attachments";

export interface AttachmentsSectionProps {
  readonly attachments: readonly Attachment[];
  /** Present in edit mode; absent means read-only view mode. */
  readonly onAttachmentsChange?: (attachments: Attachment[]) => void;
  /** Disables add/delete while the parent is saving. */
  readonly isProcessing?: boolean;
}

interface PreviewState {
  readonly attachment: Attachment;
  readonly url: string;
}

export function AttachmentsSection({
  attachments,
  onAttachmentsChange,
  isProcessing = false,
}: AttachmentsSectionProps): React.JSX.Element {
  const isEditing = onAttachmentsChange !== undefined;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<PreviewState | null>(null);

  const closePreview = React.useCallback((): void => {
    if (preview !== null) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
    }
  }, [preview]);

  const handleAddFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (onAttachmentsChange === undefined) return;
    const files = [...(event.target.files ?? [])];
    // Reset so the same file can be picked again after a delete.
    event.target.value = "";
    if (files.length === 0) return;
    try {
      const result = await filesToAttachments(attachments, files);
      for (const error of result.errors) {
        toast.error(error);
      }
      if (result.attachments.length !== attachments.length) {
        onAttachmentsChange(result.attachments);
      }
    } catch {
      toast.error("Could not read the selected file. Please try again.");
    }
  };

  const handleDownload = async (attachment: Attachment): Promise<void> => {
    try {
      await downloadAttachment(attachment);
    } catch {
      toast.error(`Could not download "${attachment.file_name}".`);
    }
  };

  const handlePreview = (attachment: Attachment): void => {
    if (preview !== null) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview({ attachment, url: previewUrlFor(attachment) });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PaperclipIcon className="size-4 text-muted-foreground" />
            Attachments
          </CardTitle>
          <CardDescription>
            Files are stored inside the encrypted vault. Up to 10 files, 5 MB
            each.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isEditing ? "No files attached yet." : "No attachments."}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {attachments.map((attachment) => {
                const date = formatAttachmentDate(attachment.created_at);
                const Icon = isImageAttachment(attachment)
                  ? ImageIcon
                  : FileIcon;
                return (
                  <li
                    key={attachment.id}
                    className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {attachment.file_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatAttachmentSize(attachment.size_bytes)}
                        {date !== null ? ` · ${date}` : ""}
                      </span>
                    </span>
                    {isImageAttachment(attachment) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(): void => {
                          handlePreview(attachment);
                        }}
                      >
                        <EyeIcon className="size-4" />
                        Preview
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(): void => {
                        void handleDownload(attachment);
                      }}
                    >
                      <DownloadIcon className="size-4" />
                      Download
                    </Button>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isProcessing}
                        onClick={(): void => {
                          onAttachmentsChange(
                            attachments.filter((a) => a.id !== attachment.id),
                          );
                        }}
                      >
                        <Trash2Icon className="size-4" />
                        Delete
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {isEditing && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event): void => {
                  void handleAddFiles(event);
                }}
              />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isProcessing}
                  onClick={(): void => {
                    fileInputRef.current?.click();
                  }}
                >
                  <PlusIcon className="size-4" />
                  Add files
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={preview !== null}
        onOpenChange={(open): void => {
          if (!open) closePreview();
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate">
              {preview?.attachment.file_name ?? ""}
            </DialogTitle>
            <DialogDescription>
              Preview only — no file is written to disk.
            </DialogDescription>
          </DialogHeader>
          {preview !== null && (
            <img
              src={preview.url}
              alt={preview.attachment.file_name}
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
