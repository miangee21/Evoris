//src/App.tsx
import type React from "react";
import { useEffect } from "react";
import { AppProviders } from "./app/providers/app-providers";

function DisableBrowserDefaults(): React.ReactNode {
  useEffect((): (() => void) => {
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Prevent F5 and Ctrl+R / Cmd+R
      if (
        e.key === "F5" ||
        (e.ctrlKey && e.key === "r") ||
        (e.metaKey && e.key === "r")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return (): void => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

export default function App(): React.ReactNode {
  return (
    <>
      <DisableBrowserDefaults />
      <AppProviders />
    </>
  );
}
