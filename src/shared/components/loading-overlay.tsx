//src/shared/components/loading-overlay.tsx
import type { ReactNode } from "react";
import { Loader2Icon } from "lucide-react";

interface LoadingOverlayProps {
  readonly isVisible: boolean;
  readonly message?: string;
}

export function LoadingOverlay({
  isVisible,
  message = "Please wait...",
}: LoadingOverlayProps): ReactNode {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-fast">
      <Loader2Icon className="size-10 animate-spin text-primary" />
      <p className="mt-4 text-sm font-medium text-foreground">{message}</p>
    </div>
  );
}
