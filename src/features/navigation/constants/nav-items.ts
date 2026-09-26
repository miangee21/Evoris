//src/features/navigation/constants/nav-items.ts
import {
  DatabaseIcon,
  FolderIcon,
  Trash2Icon,
  SettingsIcon,
} from "lucide-react";
import { ROUTE_PATHS } from "@/app/router/route-paths";

export interface NavItem {
  readonly name: string;
  readonly path: string;
  readonly icon: React.ElementType;
  readonly isActive: (currentPath: string) => boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Items",
    path: ROUTE_PATHS.VAULT, // /vault
    icon: DatabaseIcon,
    isActive: (currentPath) =>
      currentPath.startsWith(ROUTE_PATHS.VAULT) &&
      !currentPath.startsWith(ROUTE_PATHS.SETTINGS),
  },
  {
    name: "Categories",
    path: ROUTE_PATHS.CATEGORIES, // /categories
    icon: FolderIcon,
    isActive: (currentPath) => currentPath.startsWith(ROUTE_PATHS.CATEGORIES),
  },
  {
    name: "Trash",
    path: ROUTE_PATHS.TRASH, // /trash
    icon: Trash2Icon,
    isActive: (currentPath) => currentPath.startsWith(ROUTE_PATHS.TRASH),
  },
  {
    name: "Settings",
    path: ROUTE_PATHS.SETTINGS, // /settings
    icon: SettingsIcon,
    isActive: (currentPath) => currentPath.startsWith(ROUTE_PATHS.SETTINGS),
  },
];
