//src/App.tsx
import type React from "react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/features/theme/hooks/use-theme";
import { useAccent } from "@/features/theme/hooks/use-accent";
import type { ThemeMode, AccentKey } from "@/features/theme/types/theme.types";

export default function App(): React.ReactNode {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [accent, setAccent] = useState<AccentKey>("violet");

  // DOM update hooks
  useTheme(theme);
  useAccent(accent);

  const accents: readonly AccentKey[] = [
    "violet",
    "blue",
    "emerald",
    "amber",
    "rose",
    "cyan",
  ];

  return (
    <main className="min-h-screen bg-background p-page-py text-foreground duration-normal ease-out">
      <div className="mx-auto max-w-page-max space-y-8 px-page-px">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Step 2: Design System Test
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Verify all semantic tokens, theme switching, and accent palettes.
          </p>
        </header>

        {/* Theme & Accent Controls */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">1. Theme & Accent Toggles</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => {
                  setTheme("light");
                }}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => {
                  setTheme("dark");
                }}
              >
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => {
                  setTheme("system");
                }}
              >
                System
              </Button>
            </div>
            <div className="hidden w-px bg-border sm:block" />
            <div className="flex flex-wrap gap-2">
              {accents.map((a) => (
                <Button
                  key={a}
                  variant={accent === a ? "default" : "outline"}
                  onClick={() => {
                    setAccent(a);
                  }}
                  className="capitalize"
                >
                  {a}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="h-16 w-full rounded-md bg-primary" />
            <p className="text-sm font-medium text-primary">Primary</p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="h-16 w-full rounded-md bg-destructive" />
            <p className="text-sm font-medium text-destructive">Destructive</p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="h-16 w-full rounded-md bg-success" />
            <p className="text-sm font-medium text-success">Success</p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="h-16 w-full rounded-md bg-warning" />
            <p className="text-sm font-medium text-warning">Warning</p>
          </div>
        </section>

        {/* Surfaces & Radius */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-md">
          <h2 className="text-xl font-semibold">
            2. Surfaces, Radius & Typography
          </h2>
          <div className="space-y-4">
            <div className="rounded-full bg-muted p-4">
              <p className="text-center font-mono text-sm text-muted-foreground">
                Radius Full + Muted Surface + Mono Font
              </p>
            </div>
            <div className="rounded-lg bg-accent p-4 text-accent-foreground">
              <p className="text-center font-sans font-medium">
                Radius LG + Accent Surface + Sans Font
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
