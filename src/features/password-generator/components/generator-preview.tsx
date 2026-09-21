//src/features/password-generator/components/generator-preview.tsx
import { useMemo } from "react";
import { CHAR_SETS } from "../lib/character-sets";

interface GeneratorPreviewProps {
  readonly password: string;
}

export function GeneratorPreview({
  password,
}: GeneratorPreviewProps): React.JSX.Element {
  const coloredPassword = useMemo(() => {
    if (!password) {
      return (
        <span className="text-muted-foreground text-sm">
          Select options to generate
        </span>
      );
    }

    return password.split("").map((char, index) => {
      let colorClass = "text-foreground";
      if (CHAR_SETS.NUMBERS.includes(char)) {
        colorClass = "text-blue-500 dark:text-blue-400";
      } else if (CHAR_SETS.SYMBOLS.includes(char)) {
        colorClass = "text-rose-500 dark:text-rose-400";
      }
      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      );
    });
  }, [password]);

  return (
    <div className="flex min-h-32 w-full items-center justify-center rounded-md border border-input bg-muted/30 p-4 shadow-inner">
      <p className="w-full break-all text-center font-mono text-xl leading-relaxed tracking-wider whitespace-pre-wrap">
        {coloredPassword}
      </p>
    </div>
  );
}
