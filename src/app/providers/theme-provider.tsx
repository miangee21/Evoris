//src/app/providers/theme-provider.tsx
import { useEffect } from "react";
import { useThemeStore } from "@/features/theme/store/theme.store";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  // Use our new global theme motor instead of the vault session
  const theme = useThemeStore((s) => s.theme);
  const accent = useThemeStore((s) => s.accent);

  useEffect(() => {
    const root = window.document.documentElement;

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
  }, [theme, accent]);

  return <>{children}</>;
}
