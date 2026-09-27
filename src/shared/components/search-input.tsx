//src/shared/components/search-input.tsx
import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  className,
  ...props
}: SearchInputProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "relative flex items-center w-45 sm:w-60 md:w-70",
        className,
      )}
    >
      <SearchIcon className="absolute left-2.5 size-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e): void => {
          onChange(e.target.value);
        }}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 pr-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-1 flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="Clear search"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
