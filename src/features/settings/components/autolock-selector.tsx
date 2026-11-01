//src/features/settings/components/autolock-selector.tsx
import { TimerIcon } from "lucide-react";
import { useVaultSettings } from "../hooks/use-vault-settings";
import { AUTOLOCK_SECONDS_OPTIONS } from "@/features/autolock/constants/autolock-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";

// Labels required by the spec: 10s, 15s, 20s, 30s, 1m, 3m, 5m.
function formatAutolockLabel(seconds: number): string {
  if (seconds < 60) {
    return `${String(seconds)}s`;
  }
  return `${String(seconds / 60)}m`;
}

export function AutolockSelector(): React.JSX.Element {
  const { autoLockEnabled, lockTimeoutSeconds, updateAutolock, isSaving } =
    useVaultSettings();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
            <TimerIcon className="size-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">
              Auto-lock when idle
            </div>
            <div className="text-[10px] text-muted-foreground">
              Lock the vault after a period of inactivity.
            </div>
          </div>
        </div>
        <Switch
          checked={autoLockEnabled}
          disabled={isSaving}
          aria-label="Auto-lock when idle"
          onCheckedChange={(checked): void => {
            void updateAutolock(checked);
          }}
        />
      </div>

      {autoLockEnabled && (
        <div className="flex items-center gap-3 pl-9.5">
          <label
            htmlFor="autolock-timeout"
            className="text-xs font-medium text-foreground"
          >
            Lock after
          </label>
          <Select
            value={String(lockTimeoutSeconds)}
            disabled={isSaving}
            onValueChange={(value): void => {
              const seconds = Number(value);
              if (AUTOLOCK_SECONDS_OPTIONS.includes(seconds)) {
                void updateAutolock(true, seconds);
              }
            }}
          >
            <SelectTrigger id="autolock-timeout" className="min-w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUTOLOCK_SECONDS_OPTIONS.map((seconds) => (
                <SelectItem key={seconds} value={String(seconds)}>
                  {formatAutolockLabel(seconds)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Locking wipes the decrypted vault from memory and only the master
        password is needed to unlock again.
      </p>
    </div>
  );
}
