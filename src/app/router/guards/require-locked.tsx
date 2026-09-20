//src/app/router/guards/require-locked.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { ROUTE_PATHS } from "../route-paths";

export function RequireLocked(): React.JSX.Element {
  const status = useSessionStore((s) => s.status);

  if (status === "unlocked") {
    return <Navigate to={ROUTE_PATHS.VAULT} replace />;
  }

  return <Outlet />;
}
