//src/features/password-generator/components/generator-toggles.tsx
import type { PasswordGeneratorOptions } from "../types/generator.types";

interface GeneratorTogglesProps {
  readonly options: PasswordGeneratorOptions;
  readonly onChange: (updates: Partial<PasswordGeneratorOptions>) => void;
}

// Fallback native toggle if Shadcn switch is missing, styled with Tailwind
function NativeToggle({
  checked,
  onChange,
  label,
  description,
}: {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: string;
  readonly description?: string;
}): React.JSX.Element {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-2 transition-colors hover:bg-accent/50">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
          className="peer sr-only"
        />
        <div className="h-5 w-9 rounded-full bg-input transition-colors peer-checked:bg-primary" />
        <div className="absolute left-0.5 top-0.5 size-4 rounded-full bg-background transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

export function GeneratorToggles({
  options,
  onChange,
}: GeneratorTogglesProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <NativeToggle
        label="Uppercase Letters"
        checked={options.uppercase}
        onChange={(v) => {
          onChange({ uppercase: v });
        }}
      />
      <NativeToggle
        label="Lowercase Letters"
        checked={options.lowercase}
        onChange={(v) => {
          onChange({ lowercase: v });
        }}
      />
      <NativeToggle
        label="Numbers"
        checked={options.numbers}
        onChange={(v) => {
          onChange({ numbers: v });
        }}
      />
      <NativeToggle
        label="Symbols"
        checked={options.symbols}
        onChange={(v) => {
          onChange({ symbols: v });
        }}
      />
      <div className="my-1 h-px bg-border" />
      <NativeToggle
        label="Avoid Ambiguous Characters"
        description="Excludes characters like 1, l, I, 0, O"
        checked={options.excludeAmbiguous}
        onChange={(v) => {
          onChange({ excludeAmbiguous: v });
        }}
      />
    </div>
  );
}
