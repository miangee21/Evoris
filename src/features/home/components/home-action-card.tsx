//src/features/home/components/home-action-card.tsx
import type { ReactNode, KeyboardEvent } from "react";

interface HomeActionCardProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly onClick: () => void;
}

export function HomeActionCard({
  icon,
  title,
  description,
  onClick,
}: HomeActionCardProps): React.JSX.Element {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all duration-normal ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-normal group-hover:bg-primary/10 group-hover:text-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
