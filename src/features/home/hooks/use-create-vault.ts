//src/features/home/hooks/use-create-vault.ts
import { useState } from "react";
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { save } from "@tauri-apps/plugin-dialog";
import { documentDir } from "@tauri-apps/api/path";
import { useNavigate } from "react-router-dom";
import {
  createVaultSchema,
  type CreateVaultFormValues,
} from "../schemas/create-vault.schema";
import { createVaultCmd } from "@/features/vault-session/api/vault.commands";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { ROUTE_PATHS } from "@/app/router/route-paths";
import { notifyError, notifySuccess } from "@/shared/lib/errors";
import type { BlobMood } from "./use-blob-companion";
import { VAULT_FILE_EXTENSION } from "@/shared/constants/app.constants";

export interface UseCreateVaultOptions {
  readonly setBlobMood: (mood: BlobMood) => void;
}

export interface UseCreateVaultResult {
  readonly register: UseFormRegister<CreateVaultFormValues>;
  readonly errors: FieldErrors<CreateVaultFormValues>;
  readonly masterPasswordValue: string;
  readonly isProcessing: boolean;
  readonly submitForm: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  readonly resetForm: () => void;
  readonly setValue: UseFormSetValue<CreateVaultFormValues>;
}

export function useCreateVault({
  setBlobMood,
}: UseCreateVaultOptions): UseCreateVaultResult {
  const navigate = useNavigate();
  const setUnlocked = useSessionStore((state) => state.setUnlocked);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateVaultFormValues>({
    resolver: zodResolver(createVaultSchema),
    mode: "onChange",
  });

  const masterPasswordValue = watch("masterPassword", "");

  const onSubmit = async (data: CreateVaultFormValues): Promise<void> => {
    try {
      setBlobMood("hmm");
      const docsPath = await documentDir();

      const selectedPath = await save({
        defaultPath: `${docsPath}/${data.vaultName}.${VAULT_FILE_EXTENSION}`,
        filters: [{ name: "Evoris Vault", extensions: [VAULT_FILE_EXTENSION] }],
      });

      if (!selectedPath) {
        setBlobMood("neutral");
        return;
      }

      setIsProcessing(true);
      const result = await createVaultCmd(selectedPath, data.masterPassword);

      if (result.ok) {
        setBlobMood("happy");
        setUnlocked(
          selectedPath,
          data.vaultName,
          [...result.value.items],
          [...result.value.categories],
          result.value.settings,
        );
        notifySuccess(
          "Vault Created",
          "Your new offline vault is securely encrypted and ready.",
        );
        void navigate(ROUTE_PATHS.VAULT);
      } else {
        setBlobMood("sad");
        console.error("Vault creation failed:", result.error);
        notifyError(result.error);
      }
    } catch (err) {
      setBlobMood("sad");
      console.error("OS Dialog error:", err);
      notifyError("UNKNOWN");
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
    masterPasswordValue,
    isProcessing,
    submitForm,
    resetForm: reset,
    setValue,
  };
}
