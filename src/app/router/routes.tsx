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
import { CategoriesPage } from "@/features/categories/components/categories-page";
import { ItemsPage } from "@/features/items/components/items-page";
import { ItemCreatePage } from "@/features/items/components/item-create-page";
import { ItemDetailPage } from "@/features/items/components/item-detail-page";
import { TrashPage } from "@/features/trash/components/trash-page";

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
          { path: ROUTE_PATHS.VAULT, element: <ItemsPage /> },
          { path: ROUTE_PATHS.VAULT_NEW, element: <ItemCreatePage /> },
          { path: ROUTE_PATHS.VAULT_DETAIL, element: <ItemDetailPage /> },
          { path: ROUTE_PATHS.CATEGORIES, element: <CategoriesPage /> },
          { path: ROUTE_PATHS.TRASH, element: <TrashPage /> },
          { path: ROUTE_PATHS.SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
