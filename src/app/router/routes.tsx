//src/app/router/routes.tsx
import { createHashRouter, Outlet } from "react-router-dom";
import { ROUTE_PATHS } from "./route-paths";
import { RequireLocked } from "./guards/require-locked";
import { RequireUnlocked } from "./guards/require-unlocked";

export const router = createHashRouter([
  {
    element: <RequireLocked />,
    children: [
      {
        element: (
          <div id="standalone-layout">
            <Outlet />
          </div>
        ),
        children: [
          { path: ROUTE_PATHS.SPLASH, element: <div>Splash Screen</div> },
          { path: ROUTE_PATHS.HOME, element: <div>Home Screen</div> },
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
