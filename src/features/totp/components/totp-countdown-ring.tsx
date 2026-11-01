//src/features/totp/components/totp-countdown-ring.tsx
import * as React from "react";
import {
  TOTP_PERIOD_SECONDS,
  TOTP_WARNING_THRESHOLD_SECONDS,
} from "../constants/totp-config";

const VIEWBOX_SIZE = 48;
const STROKE_WIDTH = 4;
const RADIUS = (VIEWBOX_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface TotpCountdownRingProps {
  readonly secondsRemaining: number;
  readonly period?: number;
  readonly className?: string;
}

export function TotpCountdownRing({
  secondsRemaining,
  period = TOTP_PERIOD_SECONDS,
  className = "",
}: TotpCountdownRingProps): React.JSX.Element {
  const clamped = Math.max(0, Math.min(secondsRemaining, period));
  const fraction = period > 0 ? clamped / period : 0;
  const isWarning = clamped > 0 && clamped <= TOTP_WARNING_THRESHOLD_SECONDS;
  const progressColor = isWarning ? "var(--warning)" : "var(--accent-base)";

  return (
    <svg
      role="img"
      aria-label={`${String(clamped)} seconds remaining`}
      viewBox={`0 0 ${String(VIEWBOX_SIZE)} ${String(VIEWBOX_SIZE)}`}
      className={`shrink-0 ${className}`}
      style={{
        width: "var(--totp-ring-size)",
        height: "var(--totp-ring-size)",
      }}
    >
      <circle
        cx={VIEWBOX_SIZE / 2}
        cy={VIEWBOX_SIZE / 2}
        r={RADIUS}
        fill="none"
        style={{
          stroke: "var(--border)",
          strokeWidth: "var(--totp-ring-stroke)",
        }}
      />
      <circle
        cx={VIEWBOX_SIZE / 2}
        cy={VIEWBOX_SIZE / 2}
        r={RADIUS}
        fill="none"
        strokeLinecap="round"
        transform={`rotate(-90 ${String(VIEWBOX_SIZE / 2)} ${String(VIEWBOX_SIZE / 2)})`}
        style={{
          stroke: progressColor,
          strokeWidth: "var(--totp-ring-stroke)",
          strokeDasharray: CIRCUMFERENCE,
          strokeDashoffset: CIRCUMFERENCE * (1 - fraction),
          transition: "stroke-dashoffset 1s linear, stroke 300ms ease",
        }}
      />
      <text
        x={VIEWBOX_SIZE / 2}
        y={VIEWBOX_SIZE / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: "var(--foreground)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
        }}
      >
        {clamped}
      </text>
    </svg>
  );
}
