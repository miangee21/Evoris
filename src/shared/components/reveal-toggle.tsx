//src/shared/components/reveal-toggle.tsx
import type { ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface RevealToggleProps {
  readonly isRevealed: boolean;
  readonly onToggle: () => void;
  readonly className?: string;
}

export function RevealToggle({
  isRevealed,
  onToggle,
  className = "",
}: RevealToggleProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      aria-label={isRevealed ? "Hide password" : "Show password"}
    >
      {isRevealed ? (
        <EyeOffIcon className="size-4" />
      ) : (
        <EyeIcon className="size-4" />
      )}
    </button>
  );
}
