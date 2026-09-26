//src/features/navigation/components/bottom-dock.tsx
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { useNavigationMode } from "../hooks/use-navigation-mode";
import { NAV_ITEMS } from "../constants/nav-items";
import { Dock, DockIcon } from "@/shared/components/ui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { LockButton } from "./lock-button";

export function BottomDock(): React.JSX.Element | null {
  const { showDock } = useNavigationMode();
  const { pathname } = useLocation();

  if (!showDock) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-max pointer-events-auto">
      <Dock className="items-center bg-background/90 backdrop-blur-md border shadow-lg rounded-full px-4">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);
          return (
            <DockIcon key={item.path}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      to={item.path}
                      className={cn(
                        "relative flex size-full items-center justify-center rounded-full transition-colors hover:bg-muted/50",
                        active
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      aria-label={item.name}
                    />
                  }
                >
                  <item.icon className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={12}>
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          );
        })}

        {/* Separator before Lock */}
        <div className="mx-2 h-8 w-px bg-border" />

        <DockIcon>
          <div className="flex size-full items-center justify-center">
            <LockButton
              variant="ghost"
              className="size-full rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            />
          </div>
        </DockIcon>
      </Dock>
    </div>
  );
}
