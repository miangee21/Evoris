//src/app/providers/theme-provider.tsx
import { useEffect } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const settings = useSessionStore((s) => s.settings);

  useEffect(() => {
    const root = window.document.documentElement;
    const { theme, accent } = settings;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply the accent color via data-attribute
    root.dataset["accent"] = accent;
  }, [settings]);

  return <>{children}</>;
}
