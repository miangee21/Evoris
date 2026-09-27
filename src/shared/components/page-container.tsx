//src/shared/components/page-container.tsx
import * as React from "react";
import { cn } from "@/shared/lib/utils";

type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "h-[calc(100vh-var(--topbar-height,56px))] w-full overflow-y-auto animate-in fade-in duration-slow ease-out",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
