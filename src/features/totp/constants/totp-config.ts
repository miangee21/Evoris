//src/features/totp/constants/totp-config.ts
import { TOTP_DIGITS, TOTP_PERIOD_SECONDS } from "@/shared/constants/limits";

export const TOTP_ALGORITHM = "SHA-1" as const;

export { TOTP_DIGITS, TOTP_PERIOD_SECONDS };

export const TOTP_WARNING_THRESHOLD_SECONDS = 5;
