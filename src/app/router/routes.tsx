//src/app/router/routes.tsx
import { createHashRouter } from "react-router-dom";
import { ROUTE_PATHS } from "./route-paths";
import { RequireLocked } from "./guards/require-locked";
import { RequireUnlocked } from "./guards/require-unlocked";
import { StandaloneLayout } from "../layouts/standalone-layout";
import { VaultLayout } from "../layouts/vault-layout";
import { SplashScreen } from "@/features/splash/components/splash-screen";
import { HomeScreen } from "@/features/home/components/home-screen";
import { UnlockScreen } from "@/features/vault-session/components/unlock-screen";
import { SettingsPage } from "@/features/settings/components/settings-page";

export const router = createHashRouter([
  {
    element: <RequireLocked />,
    children: [
      {
        element: <StandaloneLayout />,
        children: [
          { path: ROUTE_PATHS.SPLASH, element: <SplashScreen /> },
          { path: ROUTE_PATHS.HOME, element: <HomeScreen /> },
          { path: ROUTE_PATHS.UNLOCK, element: <UnlockScreen /> },
        ],
      },
    ],
  },
  {
    element: <RequireUnlocked />,
    children: [
      {
        element: <VaultLayout />,
        children: [
          { path: ROUTE_PATHS.VAULT, element: <div>Items List</div> },
          { path: ROUTE_PATHS.VAULT_NEW, element: <div>Create Item</div> },
          { path: ROUTE_PATHS.VAULT_DETAIL, element: <div>Item Detail</div> },
          { path: ROUTE_PATHS.CATEGORIES, element: <div>Categories</div> },
          { path: ROUTE_PATHS.TRASH, element: <div>Trash</div> },
          { path: ROUTE_PATHS.SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
