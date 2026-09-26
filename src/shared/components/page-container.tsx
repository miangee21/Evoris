//src/shared/components/page-container.tsx
import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly hasDock?: boolean;
}

export function PageContainer({
  className,
  hasDock,
  children,
  ...props
}: PageContainerProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-(--page-max-width) px-(--page-padding-x) py-(--page-padding-y)",
        hasDock && "pb-24",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
