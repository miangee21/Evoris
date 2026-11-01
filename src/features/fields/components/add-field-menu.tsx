//src/features/fields/components/add-field-menu.tsx
import * as React from "react";
import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  FIELD_TYPES,
  type FieldTypeDefinition,
} from "../constants/field-types";

interface AddFieldMenuProps {
  readonly onAdd: (typeDef: FieldTypeDefinition) => void;
}

export function AddFieldMenu({ onAdd }: AddFieldMenuProps): React.JSX.Element {
  return (
    <div className="flex w-full justify-center pt-2 pb-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-dashed border-border bg-transparent px-8 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/50 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <PlusIcon className="size-4" />
          Add Custom Field
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-56">
          {FIELD_TYPES.map((typeDef) => {
            const IconComponent = typeDef.icon;
            return (
              <DropdownMenuItem
                key={typeDef.key}
                onClick={(): void => {
                  onAdd(typeDef);
                }}
                className="flex cursor-pointer items-center gap-3 py-2"
              >
                <IconComponent className="size-4 opacity-70" />
                <span className="font-medium">{typeDef.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
