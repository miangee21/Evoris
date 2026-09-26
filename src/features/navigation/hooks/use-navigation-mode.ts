//src/features/navigation/hooks/use-navigation-mode.ts
import { useSessionStore } from "@/features/vault-session/store/session.store";

export interface UseNavigationModeResult {
  readonly showTopBarNav: boolean;
  readonly showDock: boolean;
}

export function useNavigationMode(): UseNavigationModeResult {
  const navigationMode = useSessionStore(
    (state) => state.settings.navigation_mode,
  );

  return {
    showTopBarNav:
      navigationMode === "both" || navigationMode === "top-bar-only",
    showDock: navigationMode === "both" || navigationMode === "dock-only",
  };
}
