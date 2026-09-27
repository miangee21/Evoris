//src/shared/components/empty-state.tsx
import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
  readonly action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex min-h-100 flex-col items-center justify-center p-8 text-center animate-in fade-in duration-normal",
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mb-3 max-w-75 text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
