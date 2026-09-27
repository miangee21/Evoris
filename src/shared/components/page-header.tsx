//src/shared/components/page-header.tsx
import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly title: string;
  readonly description?: string;
  readonly actions?: React.ReactNode;
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
        "sticky top-0 z-10 bg-background px-6 pb-4 pt-6 sm:px-10 sm:pt-10",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-0 text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground pb-0.5">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        <div className="mt-1.5 h-px w-full bg-border" />
      </div>
    </div>
  );
}
