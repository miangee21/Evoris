//src/shared/components/password-input.tsx
import { forwardRef, useState } from "react";
import { Wand2Icon } from "lucide-react";
import { RevealToggle } from "./reveal-toggle";
import { CopyButton } from "./copy-button";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly copyValue?: string;
  readonly showCopy?: boolean;
  readonly showGenerator?: boolean;
  readonly onGenerate?: () => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className = "",
      copyValue = "",
      showCopy = false,
      showGenerator = false,
      onGenerate,
      ...props
    },
    ref,
  ) => {
    // Encapsulate reveal state so we don't have to manage it in parent components
    const [isRevealed, setIsRevealed] = useState(false);

    return (
      <div className="relative flex items-center">
        <input
          ref={ref}
          type={isRevealed ? "text" : "password"}
          // Adjust right padding dynamically based on how many icons we are rendering
          className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            showCopy && showGenerator
              ? "pr-26"
              : showCopy || showGenerator
                ? "pr-18"
                : "pr-10"
          } ${className}`}
          autoComplete="off"
          data-lpignore="true" // Stops LastPass/Bitwarden from messing with our secure inputs
          {...props}
        />
        <div className="absolute right-1 flex items-center gap-0.5">
          {showGenerator && (
            <button
              type="button"
              onClick={onGenerate}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="Generate Password"
            >
              <Wand2Icon className="size-4" />
            </button>
          )}
          {showCopy && (
            <CopyButton value={copyValue} className="h-8 w-8 p-0!" />
          )}
          <RevealToggle
            isRevealed={isRevealed}
            onToggle={() => {
              setIsRevealed(!isRevealed);
            }}
          />
        </div>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
