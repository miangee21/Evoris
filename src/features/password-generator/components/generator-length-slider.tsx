//src/features/password-generator/components/generator-length-slider.tsx
import {
  GENERATOR_MIN_LENGTH,
  GENERATOR_MAX_LENGTH,
} from "@/shared/constants/limits";

interface GeneratorLengthSliderProps {
  readonly length: number;
  readonly onChange: (length: number) => void;
}

export function GeneratorLengthSlider({
  length,
  onChange,
}: GeneratorLengthSliderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Password Length
        </label>
        <span className="text-sm font-bold text-primary">{length}</span>
      </div>
      <input
        type="range"
        min={GENERATOR_MIN_LENGTH}
        max={GENERATOR_MAX_LENGTH}
        value={length}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
