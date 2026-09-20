//src/features/splash/components/splash-screen.tsx
import { useState, useEffect } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { useSplashTimer } from "../hooks/use-splash-timer";
import { Logo } from "@/shared/components/logo";
import { APP_NAME } from "@/shared/constants/app.constants";

const LOADING_STEPS = [
  "Initializing secure environment...",
  "Waking up Rust core...",
  "Checking vault status...",
];

export function SplashScreen(): React.JSX.Element {
  useSplashTimer();
  const [loadingText, setLoadingText] = useState<string>(
    LOADING_STEPS[0] ?? "Initializing...",
  );
  const [version, setVersion] = useState<string>("...");

  useEffect(() => {
    let isMounted = true;

    // Fetch dynamic version from Tauri backend
    getVersion()
      .then((v) => {
        if (isMounted) setVersion(`v${v}`);
      })
      .catch(() => {
        // Fallback fallback if Tauri API fails (e.g. in browser dev mode)
        if (isMounted) setVersion("v0.1.0");
      });

    // Rotate text to simulate background processes
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < LOADING_STEPS.length && isMounted) {
        setLoadingText(LOADING_STEPS[step] ?? "");
      }
    }, 800); // changes text every 800ms during the 2.5s splash

    return (): void => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-between overflow-hidden bg-background p-8">
      {/* Background Doodle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-accent-base opacity-30 transition-opacity duration-normal dark:opacity-[0.06] mask-[url('/home-doodle.svg')] mask-center mask-no-repeat mask-cover [-webkit-mask-image:url('/home-doodle.svg')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:cover]"
      />

      {/* Top Spacer - pushes center content to exact middle */}
      <div className="flex-1" />

      {/* Center Content with Animation */}
      <div className="relative z-10 animate-in fade-in zoom-in-95 duration-slow ease-spring flex flex-col items-center gap-6">
        <Logo className="size-28 drop-shadow-md" />
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {APP_NAME}
          </h1>
          <p className="animate-pulse text-sm font-medium text-muted-foreground">
            {loadingText}
          </p>
        </div>
      </div>

      {/* Bottom Footer for "Pro Security" look */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-end">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {version} • Offline & Secure
        </p>
      </div>
    </div>
  );
}
