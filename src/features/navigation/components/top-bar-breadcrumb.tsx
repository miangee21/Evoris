//src/features/navigation/components/top-bar-breadcrumb.tsx
import { useLocation } from "react-router-dom";
import { useSessionStore } from "@/features/vault-session/store/session.store";
import { APP_NAME } from "@/shared/constants/app.constants";
import { Logo } from "@/shared/components/logo";
import { NAV_ITEMS } from "../constants/nav-items";

export function TopBarBreadcrumb(): React.JSX.Element {
  const { pathname } = useLocation();
  const rawFileName = useSessionStore((state) => state.fileName);

  // Extract just the file name from the full path (handles both \ and /)
  const fileName = rawFileName ? rawFileName.split(/[/\\]/).pop() : "";

  // Derive current page name dynamically
  const activeItem = NAV_ITEMS.find((item) => item.isActive(pathname));
  const pageName = activeItem ? activeItem.name : "Items";

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {/* Brand */}
      <div className="flex items-center gap-2 text-foreground">
        <Logo className="size-7" />
        <span className="hidden sm:inline-block">{APP_NAME}</span>
      </div>

      <span className="text-muted-foreground">/</span>

      {/* File Name */}
      {fileName && (
        <>
          <span className="text-primary font-medium">{fileName}</span>
          <span className="text-muted-foreground">/</span>
        </>
      )}

      {/* Current Page */}
      <span className="text-foreground">{pageName}</span>
    </div>
  );
}
