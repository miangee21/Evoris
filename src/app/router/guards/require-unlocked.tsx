//src/app/router/guards/require-unlocked.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { ROUTE_PATHS } from "../route-paths";

export function RequireUnlocked(): React.JSX.Element {
  const status = useSessionStore((s) => s.status);

  if (status === "locked") {
    return <Navigate to={ROUTE_PATHS.UNLOCK} replace />;
  }

  if (status === "no-vault") {
    return <Navigate to={ROUTE_PATHS.HOME} replace />;
  }

  return <Outlet />;
}
