//src/features/settings/components/appearance-section.tsx
import { PaletteIcon, GripVerticalIcon } from "lucide-react";
import { useThemeStore } from "@/features/theme/store/theme.store";
import { cn } from "@/shared/lib/utils";
import { ThemeSelector } from "./theme-selector";
import { AccentSelector } from "./accent-selector";

export function AppearanceSection(): React.JSX.Element {
  const { isPullCordEnabled, togglePullCord } = useThemeStore();

  return (
    <section className="flex flex-col gap-4 rounded-xl p-5 sm:p-6 bg-card/40 border shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <PaletteIcon className="size-5 text-primary" />
            Appearance & Aesthetics
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Customize interface theme, accents, and visual elements.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-muted/50 border font-medium">
          Client-Render
        </span>
      </div>

      {/* Theme Selection Cards */}
      <ThemeSelector />

      {/* Compact 2-Column Grid for Accent and Pull Cord */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50 mt-1">
        {/* Interface Accent Toggle */}
        <AccentSelector />

        {/* Pull Cord Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
              <GripVerticalIcon className="size-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">
                Theme Pull Cord
              </div>
              <div className="text-[10px] text-muted-foreground">
                Dangling string to switch theme.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={togglePullCord}
            role="switch"
            aria-checked={isPullCordEnabled}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isPullCordEnabled ? "bg-primary" : "bg-muted-foreground/30",
            )}
          >
            <span
              className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
                isPullCordEnabled ? "translate-x-4" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
