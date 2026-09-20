//src/app/layouts/standalone-layout.tsx
import { Outlet } from "react-router-dom";
import { PullCord } from "pullcord";
import "pullcord/pullcord.css";
import { useSessionStore } from "@/features/vault-session/store/session.store";

export function StandaloneLayout(): React.JSX.Element {
  const theme = useSessionStore((state) => state.settings.theme);

  const toggleTheme = (): void => {
    // Determine the next theme based on current
    const nextTheme = theme === "dark" ? "light" : "dark";
    // Mutate global store setting
    useSessionStore.setState((state) => ({
      settings: { ...state.settings, theme: nextTheme },
    }));
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground transition-colors duration-normal">
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
      <Outlet />
    </div>
  );
}
