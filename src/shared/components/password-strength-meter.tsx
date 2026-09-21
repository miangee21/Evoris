//src/shared/components/password-strength-meter.tsx
import { useMemo } from "react";

interface PasswordStrengthMeterProps {
  readonly value: string;
}

export function PasswordStrengthMeter({
  value,
}: PasswordStrengthMeterProps): React.JSX.Element {
  const { score, label, colorClass } = useMemo(() => {
    if (!value) {
      return { score: 0, label: "", colorClass: "bg-muted" };
    }

    let calculatedScore = 0;

    // 1. Length checks
    if (value.length >= 8) calculatedScore += 1;
    if (value.length >= 12) calculatedScore += 1;

    // 2. Character variety checks
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) calculatedScore += 1;
    if (/[0-9]/.test(value)) calculatedScore += 1;
    if (/[^A-Za-z0-9]/.test(value)) calculatedScore += 1;

    // Map the 0-5 calculated score into 1-4 visual segments
    if (calculatedScore <= 2) {
      return { score: 1, label: "Weak", colorClass: "bg-destructive" };
    }
    if (calculatedScore === 3) {
      return { score: 2, label: "Fair", colorClass: "bg-warning" };
    }
    if (calculatedScore === 4) {
      return { score: 3, label: "Good", colorClass: "bg-success/70" };
    }
    return { score: 4, label: "Strong", colorClass: "bg-success" };
  }, [value]);

  return (
    <div className="flex w-full flex-col gap-1.5">
      {/* 4 segmented bars */}
      <div className="flex h-1.5 w-full gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`h-full flex-1 rounded-full transition-colors duration-500 ${
              value && segment <= score ? colorClass : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Label text */}
      <div className="h-3 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {value ? label : ""}
      </div>
    </div>
  );
}
