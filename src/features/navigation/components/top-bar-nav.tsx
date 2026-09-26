//src/features/navigation/components/top-bar-nav.tsx
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { NAV_ITEMS } from "../constants/nav-items";

export function TopBarNav(): React.JSX.Element {
  const { pathname } = useLocation();

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const active = item.isActive(pathname);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary" // Highlighted with accent
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            <span className="hidden lg:inline-block">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
