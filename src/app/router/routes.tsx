//src/app/router/routes.tsx
import { createHashRouter, Outlet } from "react-router-dom";
import { ROUTE_PATHS } from "./route-paths";
import { RequireLocked } from "./guards/require-locked";
import { RequireUnlocked } from "./guards/require-unlocked";
import { StandaloneLayout } from "../layouts/standalone-layout";
import { SplashScreen } from "@/features/splash/components/splash-screen";
import { HomeScreen } from "@/features/home/components/home-screen";

export const router = createHashRouter([
  {
    element: <RequireLocked />,
    children: [
      {
        element: <StandaloneLayout />,
        children: [
          { path: ROUTE_PATHS.SPLASH, element: <SplashScreen /> },
          { path: ROUTE_PATHS.HOME, element: <HomeScreen /> },
          { path: ROUTE_PATHS.UNLOCK, element: <div>Unlock Screen</div> },
        ],
      },
    ],
  },
  {
    element: <RequireUnlocked />,
    children: [
      {
        element: (
          <div id="vault-layout">
            <Outlet />
          </div>
        ),
        children: [
          { path: ROUTE_PATHS.VAULT, element: <div>Items List</div> },
          { path: ROUTE_PATHS.VAULT_NEW, element: <div>Create Item</div> },
          { path: ROUTE_PATHS.VAULT_DETAIL, element: <div>Item Detail</div> },
          { path: ROUTE_PATHS.CATEGORIES, element: <div>Categories</div> },
          { path: ROUTE_PATHS.TRASH, element: <div>Trash</div> },
          { path: ROUTE_PATHS.SETTINGS, element: <div>Settings</div> },
        ],
      },
    ],
  },
]);
