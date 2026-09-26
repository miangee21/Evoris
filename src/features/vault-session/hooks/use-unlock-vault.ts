//src/features/vault-session/hooks/use-unlock-vault.ts
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForm,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";

import { useSessionStore } from "../store/session.store";
import { openVaultCmd } from "../api/vault.commands";
import { openVaultSchema } from "@/features/home/schemas/open-vault.schema";
import { notifyError } from "@/shared/lib/errors";
import { ROUTE_PATHS } from "@/app/router/route-paths";

type OpenVaultFormValues = z.infer<typeof openVaultSchema>;

interface UseUnlockVaultProps {
  readonly setBlobMood?: (
    mood: "neutral" | "happy" | "sad" | "password" | "sideEye" | "surprised",
  ) => void;
}

export interface UseUnlockVaultResult {
  register: UseFormRegister<OpenVaultFormValues>;
  errors: FieldErrors<OpenVaultFormValues>;
  isProcessing: boolean;
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleCloseVault: () => void;
  fileName: string | null;
  vaultName: string | null;
}

export function useUnlockVault({
  setBlobMood,
}: UseUnlockVaultProps = {}): UseUnlockVaultResult {
  const navigate = useNavigate();

  const fileName = useSessionStore((state) => state.fileName);
  const vaultName = useSessionStore((state) => state.vaultName);
  const setUnlocked = useSessionStore((state) => state.setUnlocked);
  const setClosed = useSessionStore((state) => state.setClosed);

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<OpenVaultFormValues>({
    resolver: zodResolver(openVaultSchema),
    defaultValues: { masterPassword: "" },
  });

  const onSubmit = async (data: OpenVaultFormValues): Promise<void> => {
    if (!fileName) return;

    try {
      setIsProcessing(true);

      const result = await openVaultCmd(fileName, data.masterPassword);

      if (!result.ok) {
        notifyError(result.error);
        setBlobMood?.("sad");

        setValue("masterPassword", "");
        setFocus("masterPassword");
        return;
      }

      setBlobMood?.("happy");

      setUnlocked(
        fileName,
        vaultName ?? "Vault",
        [...result.value.items],
        [...result.value.categories],
        result.value.settings,
      );

      setTimeout(() => {
        void navigate(ROUTE_PATHS.VAULT, { replace: true });
      }, 800);
    } catch (err) {
      console.error("Unlock error:", err);
      notifyError("UNKNOWN");
      setBlobMood?.("sad");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseVault = useCallback((): void => {
    setClosed();
    void navigate(ROUTE_PATHS.HOME, { replace: true });
  }, [setClosed, navigate]);

  return {
    register,
    errors,
    isProcessing,
    submitForm: handleSubmit(onSubmit),
    handleCloseVault,
    fileName,
    vaultName,
  };
}
