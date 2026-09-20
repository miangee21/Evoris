//src/shared/schemas/master-password.schema.ts
import { z } from "zod";
import {
  MASTER_PASSWORD_MIN_LENGTH,
  MASTER_PASSWORD_MAX_LENGTH,
} from "../constants/limits";

export const masterPasswordSchema = z
  .string()
  .min(
    MASTER_PASSWORD_MIN_LENGTH,
    `Must be at least ${String(MASTER_PASSWORD_MIN_LENGTH)} characters.`,
  )
  .max(
    MASTER_PASSWORD_MAX_LENGTH,
    `Must be at most ${String(MASTER_PASSWORD_MAX_LENGTH)} characters.`,
  )
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Must contain at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one symbol.");

export interface PasswordRequirement {
  readonly label: string;
  readonly met: boolean;
}

export function getPasswordRequirements(
  value: string,
): readonly PasswordRequirement[] {
  return [
    {
      label: `At least ${String(MASTER_PASSWORD_MIN_LENGTH)} characters`,
      met: value.length >= MASTER_PASSWORD_MIN_LENGTH,
    },
    {
      label: `Maximum ${String(MASTER_PASSWORD_MAX_LENGTH)} characters`,
      met: value.length > 0 && value.length <= MASTER_PASSWORD_MAX_LENGTH,
    },
    {
      label: "At least one uppercase letter",
      met: /[A-Z]/.test(value),
    },
    {
      label: "At least one number",
      met: /[0-9]/.test(value),
    },
    {
      label: "At least one symbol",
      met: /[^a-zA-Z0-9]/.test(value),
    },
  ];
}
