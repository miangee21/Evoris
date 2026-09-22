//src/features/home/hooks/use-open-vault.ts
import { useState } from "react";
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  openVaultSchema,
  type OpenVaultFormValues,
} from "../schemas/open-vault.schema";
import { openVaultCmd } from "@/features/vault-session/api/vault.commands";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { ROUTE_PATHS } from "@/app/router/route-paths";
import { notifyError, notifySuccess } from "@/shared/lib/errors";
import { VAULT_FILE_EXTENSION } from "@/shared/constants/app.constants";
import type { BlobMood } from "./use-blob-companion";

export interface UseOpenVaultOptions {
  readonly selectedPath: string | null;
  readonly setBlobMood: (mood: BlobMood) => void;
}

export interface UseOpenVaultResult {
  readonly register: UseFormRegister<OpenVaultFormValues>;
  readonly errors: FieldErrors<OpenVaultFormValues>;
  readonly isProcessing: boolean;
  readonly submitForm: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  readonly resetForm: () => void;
}

export function useOpenVault({
  selectedPath,
  setBlobMood,
}: UseOpenVaultOptions): UseOpenVaultResult {
  const navigate = useNavigate();
  const setUnlocked = useSessionStore((state) => state.setUnlocked);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
    reset,
  } = useForm<OpenVaultFormValues>({
    resolver: zodResolver(openVaultSchema),
    mode: "onSubmit", // Only validate on submit for login/unlock
  });

  const onSubmit = async (data: OpenVaultFormValues): Promise<void> => {
    if (!selectedPath) {
      notifyError("FILE_NOT_FOUND");
      return;
    }

    try {
      setBlobMood("hmm");
      setIsProcessing(true);

      const result = await openVaultCmd(selectedPath, data.masterPassword);

      if (result.ok) {
        setBlobMood("happy");

        // Extract filename accurately across Windows (\) and Mac/Linux (/)
        const filenameWithExt = selectedPath.split(/[/\\]/).pop() ?? "Vault";
        const vaultName = filenameWithExt.replace(
          new RegExp(`\\.${VAULT_FILE_EXTENSION}$`),
          "",
        );

        // Populate session and navigate
        setUnlocked(
          selectedPath,
          vaultName,
          [...result.value.items],
          [...result.value.categories],
          result.value.settings,
        );

        notifySuccess(
          "Vault Unlocked",
          "Your vault has been successfully decrypted and is ready to use.",
        );
        void navigate(ROUTE_PATHS.VAULT);
      } else {
        // Handle failure (wrong password, corrupted file, etc)
        setBlobMood("sad");
        notifyError(result.error);

        // Clear field and refocus so user can type again immediately
        setValue("masterPassword", "");
        setFocus("masterPassword");
      }
    } catch (err) {
      setBlobMood("sad");
      console.error("Open vault error:", err);
      notifyError("UNKNOWN");
      setValue("masterPassword", "");
      setFocus("masterPassword");
    } finally {
      setIsProcessing(false);
    }
  };

  const submitForm = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    void handleSubmit(onSubmit)(e);
  };

  return {
    register,
    errors,
    isProcessing,
    submitForm,
    resetForm: reset,
  };
}
