//src/features/password-generator/components/password-generator-modal.tsx
import { useState, useEffect, useCallback } from "react";
import { RefreshCwIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { PasswordStrengthMeter } from "@/shared/components/password-strength-meter";
import { CopyButton } from "@/shared/components/copy-button";
import { generatePassword } from "../lib/generate-password";
import type { PasswordGeneratorOptions } from "../types/generator.types";
import { GeneratorPreview } from "./generator-preview";
import { GeneratorLengthSlider } from "./generator-length-slider";
import { GeneratorToggles } from "./generator-toggles";

interface PasswordGeneratorModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onUsePassword: (password: string) => void;
}

const DEFAULT_OPTIONS: PasswordGeneratorOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

export function PasswordGeneratorModal({
  isOpen,
  onClose,
  onUsePassword,
}: PasswordGeneratorModalProps): React.JSX.Element {
  const [options, setOptions] =
    useState<PasswordGeneratorOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState("");

  const handleGenerate = useCallback(() => {
    const newPass = generatePassword(options);
    setPassword(newPass);
  }, [options]);

  // Regenerate immediately when options change
  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [options, handleGenerate, isOpen]);

  const updateOptions = (updates: Partial<PasswordGeneratorOptions>): void => {
    setOptions((prev) => ({ ...prev, ...updates }));
  };

  const handleUsePassword = (): void => {
    if (password) {
      onUsePassword(password);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[min(95vw,46rem)] max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:max-w-none">
        <div className="p-6 pb-4">
          <DialogHeader className="mb-5 gap-0">
            <DialogTitle className="text-xl font-bold">
              Password Generator
            </DialogTitle>
            <DialogDescription className="text-sm">
              Create a strong, secure, and random password.
            </DialogDescription>
          </DialogHeader>

          {/* 2-Column Horizontal Layout */}
          <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2">
            {/* Left Column: Preview & Strength */}
            <div className="flex flex-col gap-3">
              <GeneratorPreview password={password} />

              <div className="flex items-center justify-between px-1">
                <div className="w-[60%]">
                  <PasswordStrengthMeter value={password} />
                </div>
                <div className="flex items-center gap-1">
                  <CopyButton value={password} />
                  <button
                    type="button"
                    onClick={handleGenerate}
                    title="Regenerate"
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <RefreshCwIcon className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Controls */}
            <div className="flex flex-col gap-6">
              <GeneratorLengthSlider
                length={options.length}
                onChange={(l) => {
                  updateOptions({ length: l });
                }}
              />
              <GeneratorToggles options={options} onChange={updateOptions} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 rounded-b-lg border-t bg-muted/30 p-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUsePassword}
            disabled={!password}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Use Password
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
