//src/features/navigation/components/top-bar.tsx
import { useNavigationMode } from "../hooks/use-navigation-mode";
import { TopBarBreadcrumb } from "./top-bar-breadcrumb";
import { TopBarNav } from "./top-bar-nav";
import { LockButton } from "./lock-button";

export function TopBar(): React.JSX.Element {
  const { showTopBarNav } = useNavigationMode();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-(--topbar-height,3.5rem) items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
      {/* Left Region */}
      <TopBarBreadcrumb />

      {/* Right Region (Hidden in dock-only mode) */}
      {showTopBarNav && (
        <div className="flex items-center gap-4">
          <TopBarNav />
          <div className="h-4 w-px bg-border" />
          <LockButton />
        </div>
      )}
    </header>
  );
}
