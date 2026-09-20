//src/app/providers/app-providers.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "../router/routes";
import { ErrorBoundary } from "./error-boundary";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";

export function AppProviders(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" richColors closeButton />
        <ConfirmDialog />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
