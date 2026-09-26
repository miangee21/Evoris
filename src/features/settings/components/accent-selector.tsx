//src/features/settings/components/accent-selector.tsx
import { PaintbrushIcon, CheckIcon } from "lucide-react";
import {
  useThemeStore,
  type AccentColor,
} from "@/features/theme/store/theme.store";
import { cn } from "@/shared/lib/utils";

export function AccentSelector(): React.JSX.Element {
  const { accent, setAccent } = useThemeStore();

  const accents: { value: AccentColor; label: string }[] = [
    { value: "violet", label: "Violet" },
    { value: "blue", label: "Blue" },
    { value: "emerald", label: "Emerald" },
    { value: "amber", label: "Amber" },
    { value: "rose", label: "Rose" },
    { value: "cyan", label: "Cyan" },
  ];

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
          <PaintbrushIcon className="size-3.5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-foreground">
            Interface Accent
          </div>
          <div className="text-[10px] text-muted-foreground">
            App-wide primary color.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {accents.map(({ value, label }) => {
          const isActive = accent === value;
          return (
            <button
              key={value}
              type="button"
              onClick={(): void => {
                setAccent(value);
              }}
              title={label}
              className={cn(
                "relative flex size-5 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border",
                isActive
                  ? "shadow-sm border-transparent"
                  : "opacity-40 hover:opacity-100 hover:border-foreground/30 border-transparent",
                `swatch-${value}`,
              )}
              aria-pressed={isActive}
            >
              {isActive && (
                <CheckIcon className="size-3 text-current animate-in fade-in zoom-in-50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
