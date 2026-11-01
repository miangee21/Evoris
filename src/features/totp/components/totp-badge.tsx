//src/features/totp/components/totp-badge.tsx
import * as React from "react";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { CopyButton } from "@/shared/components/copy-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useTotpCode } from "../hooks/use-totp-code";
import { formatTotpCode } from "../lib/totp";
import { TotpCountdownRing } from "./totp-countdown-ring";

export interface TotpBadgeProps {
  readonly secret: string;
  readonly onChangeSecret?: () => void;
  readonly onRemove?: () => void;
  readonly className?: string;
}

export function TotpBadge({
  secret,
  onChangeSecret,
  onRemove,
  className = "",
}: TotpBadgeProps): React.JSX.Element {
  const { code, secondsRemaining, isValid } = useTotpCode(secret);
  const hasMenu = onChangeSecret !== undefined || onRemove !== undefined;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {isValid ? (
        <TotpCountdownRing secondsRemaining={secondsRemaining} />
      ) : null}
      <span className="font-mono text-base tracking-wider text-foreground">
        {isValid && code !== "" ? formatTotpCode(code) : "••• •••"}
      </span>
      {isValid && code !== "" ? <CopyButton value={code} /> : null}
      {hasMenu ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Two-factor authentication actions"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <EllipsisVerticalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onChangeSecret !== undefined ? (
              <DropdownMenuItem
                onClick={onChangeSecret}
                className="cursor-pointer"
              >
                <PencilIcon className="size-4" />
                Change secret
              </DropdownMenuItem>
            ) : null}
            {onRemove !== undefined ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={onRemove}
                className="cursor-pointer"
              >
                <Trash2Icon className="size-4" />
                Remove 2FA
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
