//src/features/settings/components/change-master-password-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRoundIcon } from "lucide-react";
import { useChangeMasterPassword } from "../hooks/use-change-master-password";
import { masterPasswordSchema } from "@/shared/schemas/master-password.schema";
import { PasswordChecklist } from "@/features/home/components/password-checklist";
import { PasswordInput } from "@/shared/components/password-input";
import { Button } from "@/shared/components/ui/button";
import { ProgressDialog } from "@/shared/components/progress-dialog";
import { PasswordGeneratorModal } from "@/features/password-generator/components/password-generator-modal";

const changeMasterPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current master password."),
    newPassword: masterPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your new master password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ChangeMasterPasswordValues = z.infer<typeof changeMasterPasswordSchema>;

export function ChangeMasterPasswordForm(): React.JSX.Element {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const {
    isChanging,
    isProgressOpen,
    progress,
    changeMasterPassword,
    closeProgress,
  } = useChangeMasterPassword();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<ChangeMasterPasswordValues>({
    resolver: zodResolver(changeMasterPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (data: ChangeMasterPasswordValues): Promise<void> => {
    const outcome = await changeMasterPassword(
      data.currentPassword,
      data.newPassword,
    );

    if (outcome === "success") {
      reset();
      closeProgress();
      return;
    }

    if (outcome === "wrong-password") {
      setValue("currentPassword", "", {
        shouldValidate: false,
        shouldDirty: false,
      });
      setFocus("currentPassword");
    }

    closeProgress();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-muted/50 border flex items-center justify-center text-primary">
          <KeyRoundIcon className="size-3.5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-foreground">
            Change master password
          </div>
          <div className="text-[10px] text-muted-foreground">
            Re-encrypts the vault with the new password. Your session continues
            afterwards — no need to sign in again.
          </div>
        </div>
      </div>

      <form
        onSubmit={(event): void => {
          void handleSubmit(onSubmit)(event);
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="current-master-password"
            className="text-xs font-medium text-foreground"
          >
            Current master password
          </label>
          <PasswordInput
            id="current-master-password"
            {...register("currentPassword")}
            autoComplete="off"
            spellCheck={false}
            disabled={isChanging}
          />
          {errors.currentPassword !== undefined && (
            <p className="text-xs text-destructive">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="new-master-password"
            className="text-xs font-medium text-foreground"
          >
            New master password
          </label>
          <PasswordInput
            id="new-master-password"
            {...register("newPassword")}
            showCopy
            showGenerator
            copyValue={newPasswordValue}
            onGenerate={() => {
              setIsGeneratorOpen(true);
            }}
            autoComplete="off"
            spellCheck={false}
            disabled={isChanging}
          />
          <PasswordChecklist value={newPasswordValue} />
          {errors.newPassword !== undefined && (
            <p className="text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirm-master-password"
            className="text-xs font-medium text-foreground"
          >
            Confirm new master password
          </label>
          <PasswordInput
            id="confirm-master-password"
            {...register("confirmPassword")}
            autoComplete="off"
            spellCheck={false}
            disabled={isChanging}
          />
          {errors.confirmPassword !== undefined && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <Button type="submit" disabled={isChanging}>
            {isChanging ? "Changing…" : "Change master password"}
          </Button>
        </div>
      </form>

      <ProgressDialog
        open={isProgressOpen}
        stage={progress.stage}
        percent={progress.percent}
        title="Changing master password"
        onOpenChange={(next): void => {
          if (!next) {
            closeProgress();
          }
        }}
      />

      <PasswordGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => {
          setIsGeneratorOpen(false);
        }}
        onUsePassword={(generatedPassword) => {
          setValue("newPassword", generatedPassword, {
            shouldValidate: true,
          });
          setValue("confirmPassword", generatedPassword, {
            shouldValidate: true,
          });
          setIsGeneratorOpen(false);
        }}
      />
    </div>
  );
}
