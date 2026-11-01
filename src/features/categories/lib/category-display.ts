//src/features/categories/lib/category-display.ts
import type { LucideIcon } from "lucide-react";
import { CATEGORY_ICONS, FALLBACK_ICON } from "../constants/category-icons";

export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICONS[icon] ?? FALLBACK_ICON;
}

export function categoryColor(color: string | undefined | null): string {
  return color && color.length > 0 ? color : "var(--color-primary)";
}

export function categoryBadgeStyle(color: string | undefined | null): {
  backgroundColor: string;
  color: string;
} {
  const resolved = categoryColor(color);
  return {
    backgroundColor: `color-mix(in srgb, ${resolved} 12%, transparent)`,
    color: resolved,
  };
}
