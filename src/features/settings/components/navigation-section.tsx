//src/features/settings/components/navigation-section.tsx
import { PanelBottomIcon, CheckIcon, InfoIcon } from "lucide-react";
import { useVaultSettings } from "../hooks/use-vault-settings";
import { cn } from "@/shared/lib/utils";

export function NavigationSection(): React.JSX.Element {
  const { navigationMode, updateNavigationMode } = useVaultSettings();

  return (
    <section className="flex flex-col gap-4 rounded-xl p-5 sm:p-6 bg-card/40 border shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <PanelBottomIcon className="size-5 text-primary" />
            Navigation & Dock Layout
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Control visibility and placement of Top Bar and Floating Dock
            navigation.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-muted/50 border font-medium">
          Interface
        </span>
      </div>

      {/* Navigation Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Top Bar Only */}
        <button
          type="button"
          onClick={() => void updateNavigationMode("top-bar-only")}
          className={cn(
            "relative text-left p-4 rounded-xl transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            navigationMode === "top-bar-only"
              ? "border-2 border-primary bg-card shadow-md shadow-primary/5"
              : "border border-border/50 bg-card/50 hover:border-border opacity-75 hover:opacity-100",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "text-sm font-semibold transition-colors",
                navigationMode === "top-bar-only"
                  ? "text-primary"
                  : "text-foreground group-hover:text-primary",
              )}
            >
              Top Bar Only
            </span>
            {navigationMode === "top-bar-only" ? (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <CheckIcon className="size-3 font-bold" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Floating header capsule active. Bottom dock remains hidden for clean
            canvas.
          </p>
        </button>

        {/* Bottom Dock Only */}
        <button
          type="button"
          onClick={() => void updateNavigationMode("dock-only")}
          className={cn(
            "relative text-left p-4 rounded-xl transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            navigationMode === "dock-only"
              ? "border-2 border-primary bg-card shadow-md shadow-primary/5"
              : "border border-border/50 bg-card/50 hover:border-border opacity-75 hover:opacity-100",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "text-sm font-semibold transition-colors",
                navigationMode === "dock-only"
                  ? "text-primary"
                  : "text-foreground group-hover:text-primary",
              )}
            >
              Bottom Dock Only
            </span>
            {navigationMode === "dock-only" ? (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <CheckIcon className="size-3 font-bold" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Top navigation capsule hidden. Minimalist bottom dock handles
            shortcuts.
          </p>
        </button>

        {/* Both Enabled */}
        <button
          type="button"
          onClick={() => void updateNavigationMode("both")}
          className={cn(
            "relative text-left p-4 rounded-xl transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            navigationMode === "both"
              ? "border-2 border-primary bg-card shadow-md shadow-primary/5"
              : "border border-border/50 bg-card/50 hover:border-border opacity-75 hover:opacity-100",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "text-sm font-semibold transition-colors",
                navigationMode === "both"
                  ? "text-primary"
                  : "text-foreground group-hover:text-primary",
              )}
            >
              Both Enabled
            </span>
            {navigationMode === "both" ? (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <CheckIcon className="size-3 font-bold" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Simultaneous dynamic top capsule and pinned bottom dock
            accessibility.
          </p>
        </button>
      </div>

      {/* Info Notice */}
      <div className="flex items-center gap-2 p-2.5 mt-1 rounded-lg bg-card border border-border/50">
        <InfoIcon className="size-4 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground font-mono">
          At least one navigation element must remain active for system access.
        </span>
      </div>
    </section>
  );
}
