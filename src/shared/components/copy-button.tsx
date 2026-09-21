//src/shared/components/copy-button.tsx
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCopyToClipboard } from "@/features/clipboard/hooks/use-copy-to-clipboard";

interface CopyButtonProps {
  readonly value: string;
  readonly className?: string;
  readonly silent?: boolean;
}

export function CopyButton({
  value,
  className = "",
  silent = false,
}: CopyButtonProps): React.JSX.Element {
  const { isCopied, copy } = useCopyToClipboard();

  const handleCopy = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation(); // Prevents triggering row clicks if embedded in a list
    void copy(value, silent);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={isCopied ? "Copied!" : "Copy to clipboard"}
      className={`inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
    >
      {isCopied ? (
        <CheckIcon className="size-4 text-success animate-in zoom-in duration-fast" />
      ) : (
        <CopyIcon className="size-4 animate-in zoom-in duration-fast" />
      )}
    </button>
  );
}
