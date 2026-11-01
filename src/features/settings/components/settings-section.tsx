//src/features/settings/components/settings-section.tsx
import type { ReactNode } from "react";

interface SettingsSectionProps {
  readonly title: string;
  readonly description: string;
  readonly icon?: ReactNode;
  readonly badge?: string;
  readonly children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  icon,
  badge,
  children,
}: SettingsSectionProps): React.JSX.Element {
  return (
    <section className="flex flex-col gap-4 rounded-xl p-5 sm:p-6 bg-card/40 border shadow-sm">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        {badge !== undefined && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-muted/50 border font-medium">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
