//src/app/layouts/standalone-layout.tsx
import { Outlet } from "react-router-dom";
import { PullCord } from "pullcord";
import "pullcord/pullcord.css";
import { useThemeStore } from "@/features/theme/store/theme.store";

export function StandaloneLayout(): React.JSX.Element {
  const { theme, setTheme, isPullCordEnabled } = useThemeStore();

  const toggleTheme = (): void => {
    // If system, switch to dark, otherwise toggle light/dark
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground transition-colors duration-normal">
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
      <Outlet />
    </div>
  );
}
