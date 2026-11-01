//src/features/totp/hooks/use-totp-code.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInterval } from "@/shared/hooks/use-interval";
import { decodeBase32 } from "../lib/base32";
import { generateTotp, getSecondsRemaining } from "../lib/totp";

export interface UseTotpCodeResult {
  readonly code: string;
  readonly secondsRemaining: number;
  readonly isValid: boolean;
}

const INACTIVE: UseTotpCodeResult = {
  code: "",
  secondsRemaining: 0,
  isValid: false,
};

export function useTotpCode(secret: string | null): UseTotpCodeResult {
  const decoded = useMemo(
    () => (secret === null ? null : decodeBase32(secret)),
    [secret],
  );
  const [state, setState] = useState<UseTotpCodeResult>(INACTIVE);
  const requestIdRef = useRef(0);

  const recompute = useCallback((): void => {
    if (decoded === null || !decoded.ok || decoded.value.length === 0) {
      requestIdRef.current += 1;
      setState(INACTIVE);
      return;
    }
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const secretBytes = decoded.value;
    const now = Date.now();
    const secondsRemaining = getSecondsRemaining(now);
    generateTotp(secretBytes, now)
      .then((code) => {
        if (requestIdRef.current === requestId) {
          setState({ code, secondsRemaining, isValid: true });
        }
      })
      .catch(() => {
        // WebCrypto unavailable or key rejected: show no code rather than
        // a stale one, but keep isValid true (the secret itself is fine).
        if (requestIdRef.current === requestId) {
          setState({ code: "", secondsRemaining, isValid: true });
        }
      });
  }, [decoded]);

  // Recompute immediately when the secret changes, not just on the next tick.
  useEffect(() => {
    recompute();
  }, [recompute]);

  useInterval(
    recompute,
    decoded !== null && decoded.ok && decoded.value.length > 0 ? 1000 : null,
  );

  return state;
}
