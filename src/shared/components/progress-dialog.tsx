//src/shared/components/progress-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const STAGE_LABELS: Readonly<Record<string, string>> = {
  starting: "Starting…",
  verifying: "Verifying current password…",
  deriving: "Deriving new key…",
  "re-encrypting & writing": "Re-encrypting & writing vault…",
  done: "Done",
};

function clampPercent(percent: number): number {
  if (Number.isNaN(percent)) return 0;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export interface ProgressDialogProps {
  readonly open: boolean;
  readonly stage: string;
  readonly percent: number;
  readonly title?: string;
  readonly onOpenChange?: (open: boolean) => void;
}

export function ProgressDialog({
  open,
  stage,
  percent,
  title = "Working…",
  onOpenChange,
}: ProgressDialogProps): React.JSX.Element {
  const clamped = clampPercent(percent);
  const isRunning = clamped < 100;
  const stageLabel = STAGE_LABELS[stage] ?? stage;

  const handleOpenChange = (next: boolean): void => {
    if (!next && isRunning) {
      return;
    }
    onOpenChange?.(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isRunning} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{stageLabel}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={stageLabel}
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${String(clamped)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{stageLabel}</span>
            <span className="tabular-nums">{`${String(clamped)}%`}</span>
          </div>
          {isRunning && (
            <p className="text-xs font-medium text-foreground">
              Do not close the app.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProgressDialog;
