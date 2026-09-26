//src/features/home/components/home-screen.tsx
import { useState, useEffect } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { FolderIcon, PlusIcon, DownloadIcon, SettingsIcon } from "lucide-react";
import { Logo } from "@/shared/components/logo";
import { open } from "@tauri-apps/plugin-dialog";
import { documentDir } from "@tauri-apps/api/path";
import {
  APP_NAME,
  VAULT_FILE_EXTENSION,
} from "@/shared/constants/app.constants";
import { HomeActionCard } from "./home-action-card";
import { HomeSettingsDialog } from "./home-settings-dialog";
import { CreateVaultDialog } from "./create-vault-dialog";
import { OpenVaultDialog } from "./open-vault-dialog";

export function HomeScreen(): React.JSX.Element {
  const [version, setVersion] = useState<string>("...");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);
  const [selectedVaultPath, setSelectedVaultPath] = useState<string | null>(
    null,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenVaultClick = async (): Promise<void> => {
    try {
      const docsPath = await documentDir();
      const selected = await open({
        multiple: false,
        defaultPath: docsPath,
        filters: [{ name: "Evoris Vault", extensions: [VAULT_FILE_EXTENSION] }],
      });

      // If user selected a file (didn't cancel)
      if (selected && typeof selected === "string") {
        setSelectedVaultPath(selected);
        setIsOpenDialogOpen(true);
      }
    } catch (err) {
      console.error("Failed to open file dialog:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getVersion()
      .then((v) => {
        if (isMounted) setVersion(`v${v}`);
      })
      .catch(() => {
        if (isMounted) setVersion("v0.1.0");
      });

    return (): void => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center overflow-hidden bg-background p-8">
      {/* Top Right Settings Button */}
      <div className="absolute right-6 top-6 z-50">
        <button
          type="button"
          onClick={(): void => {
            setIsSettingsOpen(true);
          }}
          className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open App Settings"
        >
          <SettingsIcon className="size-5" />
        </button>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-accent-base opacity-30 transition-opacity duration-normal dark:opacity-[0.06] mask-[url('/home-doodle.svg')] mask-center mask-no-repeat mask-cover [-webkit-mask-image:url('/home-doodle.svg')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:cover]"
      />

      {/* Top Spacer */}
      <div className="flex-1" />

      {/* Main Center Layout */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-4 duration-slow ease-out">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo className="size-20 drop-shadow-sm" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-muted-foreground">
              Your secure, offline, and beautiful password manager.
            </p>
          </div>
        </div>

        {/* 3 Action Cards (Stacks on mobile, side-by-side on desktop) */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          <HomeActionCard
            icon={<FolderIcon className="size-6" />}
            title="Open a Vault"
            description="Unlock an existing vault from your local storage."
            onClick={() => {
              void handleOpenVaultClick();
            }}
          />
          <HomeActionCard
            icon={<PlusIcon className="size-6" />}
            title="Create a Vault"
            description="Setup a new secure vault with a master password."
            onClick={(): void => {
              setIsCreateOpen(true);
            }}
          />
          <HomeActionCard
            icon={<DownloadIcon className="size-6" />}
            title="Import a Vault"
            description="Restore your vault from an external Evoris export."
            onClick={(): void => {
              console.warn("TODO: Import Vault - Next Step");
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-1 flex-col justify-end">
        <p className="text-sm font-medium text-muted-foreground/60">
          {version} • MIT Open Source
        </p>
      </div>

      <CreateVaultDialog
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
        }}
      />
      <OpenVaultDialog
        isOpen={isOpenDialogOpen}
        onClose={() => {
          setIsOpenDialogOpen(false);
          setSelectedVaultPath(null);
        }}
        selectedPath={selectedVaultPath}
      />
      <HomeSettingsDialog
        isOpen={isSettingsOpen}
        onClose={(): void => {
          setIsSettingsOpen(false);
        }}
      />
    </div>
  );
}
