//src/features/settings/components/theme-selector.tsx
import { CheckIcon } from "lucide-react";
import { useThemeStore } from "@/features/theme/store/theme.store";
import { cn } from "@/shared/lib/utils";

export function ThemeSelector(): React.JSX.Element {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Dark Mode */}
      <button
        type="button"
        onClick={(): void => {
          setTheme("dark");
        }}
        className={cn(
          "relative text-left p-3.5 rounded-xl transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          theme === "dark"
            ? "border-2 border-primary bg-card shadow-md shadow-primary/5"
            : "border border-border/50 bg-card/50 hover:border-border opacity-75 hover:opacity-100",
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              "text-sm font-semibold transition-colors",
              theme === "dark"
                ? "text-primary"
                : "text-foreground group-hover:text-primary",
            )}
          >
            Obsidian Dark
          </span>
          {theme === "dark" ? (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <CheckIcon className="size-3 font-bold" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>
            </div>
          )}
        </div>

        {/* Dark Wireframe Mockup */}
        <div className="dark w-full h-16 rounded-lg bg-background border border-border p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/20"></span>
            </div>
            <div className="h-1.5 w-8 rounded bg-foreground/10"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-3/4 rounded bg-foreground/10"></div>
            <div className="h-1.5 w-1/2 rounded bg-foreground/5"></div>
          </div>
        </div>
      </button>

      {/* Light Mode */}
      <button
        type="button"
        onClick={(): void => {
          setTheme("light");
        }}
        className={cn(
          "relative text-left p-3.5 rounded-xl transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          theme === "light"
            ? "border-2 border-primary bg-card shadow-md shadow-primary/5"
            : "border border-border/50 bg-card/50 hover:border-border opacity-75 hover:opacity-100",
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              "text-sm font-semibold transition-colors",
              theme === "light"
                ? "text-primary"
                : "text-foreground group-hover:text-primary",
            )}
          >
            Alabaster Light
          </span>
          {theme === "light" ? (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <CheckIcon className="size-3 font-bold" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>
            </div>
          )}
        </div>

        {/* Light Wireframe Mockup */}
        <div className="light w-full h-16 rounded-lg bg-background border border-border p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/20"></span>
            </div>
            <div className="h-1.5 w-8 rounded bg-foreground/10"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-3/4 rounded bg-foreground/10"></div>
            <div className="h-1.5 w-1/2 rounded bg-foreground/5"></div>
          </div>
        </div>
      </button>

      {/* System Auto */}
      <button
        type="button"
        onClick={(): void => {
          setTheme("system");
        }}
        className={cn(
          "relative text-left p-3.5 rounded-xl transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          theme === "system"
            ? "border-2 border-primary bg-card shadow-md shadow-primary/5"
            : "border border-border/50 bg-card/50 hover:border-border opacity-75 hover:opacity-100",
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              "text-sm font-semibold transition-colors",
              theme === "system"
                ? "text-primary"
                : "text-foreground group-hover:text-primary",
            )}
          >
            System Sync
          </span>
          {theme === "system" ? (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <CheckIcon className="size-3 font-bold" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>
            </div>
          )}
        </div>

        {/* System Mockup */}
        <div className="w-full h-16 rounded-lg overflow-hidden border border-border flex">
          <div className="dark w-1/2 h-full bg-background p-2 flex flex-col gap-2 border-r border-border">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/80"></div>
            <div className="h-1.5 w-full rounded bg-foreground/10"></div>
          </div>
          <div className="light w-1/2 h-full bg-background p-2 flex flex-col gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/80 ml-auto"></div>
            <div className="h-1.5 w-full rounded bg-foreground/10 ml-auto"></div>
          </div>
        </div>
      </button>
    </div>
  );
}
