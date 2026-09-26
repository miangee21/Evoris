//src/features/navigation/components/lock-button.tsx
import { LockKeyholeIcon, Loader2Icon } from "lucide-react";
import { useLockVault } from "../../vault-session/hooks/use-lock-vault";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface LockButtonProps {
  readonly variant?: "ghost" | "outline" | "default";
  readonly size?: "default" | "sm" | "lg" | "icon";
  readonly className?: string;
}

export function LockButton({
  variant = "ghost",
  size = "icon",
  className,
}: LockButtonProps): React.JSX.Element {
  const { lockVault, isLocking } = useLockVault();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={variant}
            size={size}
            onClick={() => void lockVault()}
            disabled={isLocking}
            className={className}
            aria-label="Lock Vault"
          />
        }
      >
        {isLocking ? (
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        ) : (
          <LockKeyholeIcon className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>Lock Vault</p>
      </TooltipContent>
    </Tooltip>
  );
}
