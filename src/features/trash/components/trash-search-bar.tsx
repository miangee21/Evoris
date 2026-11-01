//src/features/trash/components/trash-search-bar.tsx
import * as React from "react";
import { SearchInput } from "@/shared/components/search-input";

interface TrashSearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function TrashSearchBar({
  value,
  onChange,
}: TrashSearchBarProps): React.JSX.Element {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      onClear={(): void => {
        onChange("");
      }}
      placeholder="Search trash..."
    />
  );
}
