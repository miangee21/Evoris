//src/shared/components/page-header.tsx
import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly title: string;
  readonly description?: string;
  readonly actions?: React.ReactNode; // Right side slot for buttons
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
