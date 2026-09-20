//src/app/router/route-paths.ts
export const ROUTE_PATHS = {
  SPLASH: "/",
  HOME: "/home",
  UNLOCK: "/unlock",
  VAULT: "/vault",
  VAULT_NEW: "/vault/new",
  VAULT_DETAIL: "/vault/:itemId",
  CATEGORIES: "/categories",
  TRASH: "/trash",
  SETTINGS: "/settings",
} as const;
