//src/features/items/components/item-category-filter.tsx
import * as React from "react";
import { useState, useMemo, useRef } from "react";
import {
  LayoutGridIcon,
  FolderXIcon,
  ListFilterIcon,
  SearchIcon,
} from "lucide-react";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { sortByName } from "@/shared/lib/sort";
import {
  CATEGORY_ICONS,
  FALLBACK_ICON,
} from "@/features/categories/constants/category-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface ItemCategoryFilterProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function ItemCategoryFilter({
  value,
  onChange,
}: ItemCategoryFilterProps): React.JSX.Element {
  const categories = useSessionStore((state) => state.categories);
  const [searchQuery, setSearchQuery] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const selectedName = useMemo(() => {
    if (value === "all") return "All Categories";
    if (value === "uncategorized") return "Uncategorized";
    const found = categories.find((c) => c.id === value);
    return found ? found.name : "Filter";
  }, [value, categories]);

  const sortedCategories = useMemo(() => {
    let filtered = categories;
    if (searchQuery.trim().length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(lowerQuery),
      );
    }

    const isCustomSelected = value !== "all" && value !== "uncategorized";

    let selectedItem;
    let otherItems = filtered;

    if (isCustomSelected) {
      selectedItem = categories.find((c) => c.id === value);
      otherItems = filtered.filter((c) => c.id !== value);
    }

    const sortedOthers = sortByName(otherItems, (c) => c.name);

    let finalArray = sortedOthers;
    if (selectedItem) {
      if (
        searchQuery.trim().length === 0 ||
        selectedItem.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        finalArray = [selectedItem, ...sortedOthers];
      }
    }

    // Limit to 50 items strictly for DOM performance
    return finalArray.slice(0, 50);
  }, [categories, searchQuery, value]);

  return (
    <TooltipProvider delay={300}>
      <Select
        value={value}
        onValueChange={(val): void => {
          if (val !== null) {
            onChange(val);
          }
        }}
        onOpenChange={(open): void => {
          if (!open) {
            setSearchQuery("");
          } else {
            setTimeout(() => {
              if (topRef.current) {
                const scrollContainer = topRef.current.closest<HTMLElement>(
                  '[data-slot="select-content"]',
                );
                if (scrollContainer) {
                  scrollContainer.scrollTop = 0;
                }
              }
            }, 10);
          }
        }}
      >
        <Tooltip>
          <TooltipTrigger>
            <SelectTrigger
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-transparent bg-accent p-0 text-accent-foreground shadow-sm transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&>svg:last-child]:hidden"
              aria-label="Filter by category"
            >
              <ListFilterIcon className="size-4" />
            </SelectTrigger>
          </TooltipTrigger>

          <TooltipContent side="top" sideOffset={6}>
            <p className="text-xs">
              Filtered by: <span className="font-semibold">{selectedName}</span>
            </p>
          </TooltipContent>
        </Tooltip>

        <SelectContent
          alignItemWithTrigger={false}
          sideOffset={8}
          align="end"
          className="flex max-h-75 w-37.5 flex-col sm:w-42.5"
        >
          {/* Internal Search Bar inside Dropdown */}
          <div
            ref={topRef}
            className="sticky top-0 z-10 mb-1 flex items-center border-b border-border bg-popover px-2 pb-2 pt-2"
          >
            <SearchIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e): void => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e): void => {
                e.stopPropagation();
              }}
              className="flex h-7 w-full rounded-sm bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <SelectItem
            value="all"
            className={
              value === "all"
                ? "bg-accent text-accent-foreground [&>span:last-child]:hidden"
                : "[&>span:last-child]:hidden"
            }
          >
            <div className="flex w-full items-center gap-2">
              <LayoutGridIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">All Categories</span>
            </div>
          </SelectItem>

          <SelectItem
            value="uncategorized"
            className={
              value === "uncategorized"
                ? "bg-accent text-accent-foreground [&>span:last-child]:hidden"
                : "[&>span:last-child]:hidden"
            }
          >
            <div className="flex w-full items-center gap-2">
              <FolderXIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">Uncategorized</span>
            </div>
          </SelectItem>

          {sortedCategories.length > 0 && (
            <div className="my-1 h-px w-full shrink-0 bg-border" />
          )}

          {sortedCategories.map((category) => {
            const IconComponent =
              CATEGORY_ICONS[category.icon] ?? FALLBACK_ICON;

            return (
              <SelectItem
                key={category.id}
                value={category.id}
                className={
                  value === category.id
                    ? "bg-accent text-accent-foreground [&>span:last-child]:hidden"
                    : "[&>span:last-child]:hidden"
                }
              >
                <Tooltip>
                  <TooltipTrigger className="w-full text-left">
                    <div className="flex w-full items-center gap-2 overflow-hidden">
                      <IconComponent
                        className="size-4 shrink-0"
                        style={{ color: category.color }}
                      />
                      <span className="truncate">{category.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6} className="z-60">
                    <p className="text-xs">{category.name}</p>
                  </TooltipContent>
                </Tooltip>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </TooltipProvider>
  );
}
