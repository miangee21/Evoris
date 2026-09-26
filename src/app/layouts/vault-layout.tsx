//src/app/layouts/vault-layout.tsx
import { Outlet } from "react-router-dom";
import { PullCord } from "pullcord";
import "pullcord/pullcord.css";
import { TopBar } from "@/features/navigation/components/top-bar";
import { BottomDock } from "@/features/navigation/components/bottom-dock";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { useThemeStore } from "@/features/theme/store/theme.store";

export function VaultLayout(): React.JSX.Element {
  const { theme, setTheme, isPullCordEnabled } = useThemeStore();

  const toggleTheme = (): void => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground transition-colors duration-normal">
        {isPullCordEnabled && (
          <PullCord
            onPull={toggleTheme}
            pulled={theme === "dark"}
            ariaLabel="Toggle theme"
            config={{
              gravity: 1250,
              damping: 0.94,
              iterations: 20,
              stretchMax: 26,
            }}
          />
        )}
        <TopBar />
        {/* 
          Main content area. 
          pt-[var(--topbar-height,3.5rem)] ensures content doesn't hide under the fixed TopBar. 
        */}
        <main className="flex-1 pt-(--topbar-height,3.5rem)">
          <Outlet />
        </main>
        <BottomDock />
      </div>
    </TooltipProvider>
  );
}
