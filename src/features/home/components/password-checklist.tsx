//src/features/home/components/password-checklist.tsx
import { CheckIcon, XIcon } from "lucide-react";
import { getPasswordRequirements } from "@/shared/schemas/master-password.schema";

interface PasswordChecklistProps {
  readonly value: string;
}

export function PasswordChecklist({
  value,
}: PasswordChecklistProps): React.JSX.Element {
  const requirements = getPasswordRequirements(value);

  return (
    <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-muted/50 p-2 text-xs">
      {requirements.map((req) => (
        <li
          key={req.label}
          className={`flex items-center gap-1.5 whitespace-nowrap transition-colors duration-normal ${
            req.met ? "text-success" : "text-muted-foreground"
          }`}
        >
          {req.met ? (
            <CheckIcon className="size-4 text-success" />
          ) : (
            <XIcon className="size-4 opacity-50" />
          )}
          <span>{req.label}</span>
        </li>
      ))}
    </ul>
  );
}
