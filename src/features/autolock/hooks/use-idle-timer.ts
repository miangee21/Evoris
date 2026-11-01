//src/features/autolock/hooks/use-idle-timer.ts
import { useEffect, useRef } from "react";

const IDLE_CHECK_INTERVAL_MS = 1000;
const ACTIVITY_EVENTS: readonly string[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "wheel",
  "touchstart",
];

export interface UseIdleTimerOptions {
  readonly enabled: boolean;
  readonly timeoutMs: number;
  readonly onIdle: () => void;
}

export function useIdleTimer({
  enabled,
  timeoutMs,
  onIdle,
}: UseIdleTimerOptions): void {
  const lastActivityRef = useRef<number>(Date.now());
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    lastActivityRef.current = Date.now();

    const recordActivity = (): void => {
      lastActivityRef.current = Date.now();
    };

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, recordActivity, { passive: true });
    }

    const intervalId = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current >= timeoutMs) {
        onIdleRef.current();
      }
    }, IDLE_CHECK_INTERVAL_MS);

    return (): void => {
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, recordActivity);
      }
      window.clearInterval(intervalId);
    };
  }, [enabled, timeoutMs]);
}
