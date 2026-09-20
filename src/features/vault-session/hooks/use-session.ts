//src/features/vault-session/hooks/use-session.ts
import { useSessionStore } from "../store/session.store";
import type { SessionStore } from "../types/session.types";

export function useSession(): SessionStore {
  return useSessionStore();
}
