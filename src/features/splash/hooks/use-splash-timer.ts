//src/features/splash/hooks/use-splash-timer.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVaultStateCmd } from "@/features/vault-session/api/vault.commands";
import { SPLASH_DURATION_MS } from "@/shared/constants/app.constants";
import { ROUTE_PATHS } from "@/app/router/route-paths";

export function useSplashTimer(): void {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function init(): Promise<void> {
      const start = Date.now();
      const result = await getVaultStateCmd();

      const elapsed = Date.now() - start;
      const remaining = SPLASH_DURATION_MS - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      if (!isMounted) return;

      if (result.ok && result.value.file_name) {
        void navigate(ROUTE_PATHS.UNLOCK, { replace: true });
      } else {
        void navigate(ROUTE_PATHS.HOME, { replace: true });
      }
    }

    void init();

    return (): void => {
      isMounted = false;
    };
  }, [navigate]);
}
