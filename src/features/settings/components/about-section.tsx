//src/features/settings/components/about-section.tsx
import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { openUrl } from "@tauri-apps/plugin-opener";
import { InfoIcon, ExternalLinkIcon } from "lucide-react";
import { SettingsSection } from "./settings-section";
import { Button } from "@/shared/components/ui/button";
import { APP_NAME } from "@/shared/constants/app.constants";
import { GITHUB_URL } from "@/shared/constants/links";
import { notifyError } from "@/shared/lib/errors";

const APP_VERSION_FALLBACK = "0.1.0";

export function AboutSection(): React.JSX.Element {
  const [version, setVersion] = useState<string>("...");

  useEffect(() => {
    let isMounted = true;

    getVersion()
      .then((v) => {
        if (isMounted) setVersion(`v${v}`);
      })
      .catch(() => {
        if (isMounted) setVersion(`v${APP_VERSION_FALLBACK}`);
      });

    return (): void => {
      isMounted = false;
    };
  }, []);

  const handleOpenLink = (url: string): void => {
    openUrl(url).catch(() => {
      notifyError("UNKNOWN");
    });
  };

  return (
    <SettingsSection
      title="About"
      description="About this application."
      icon={<InfoIcon className="size-5 text-primary" />}
      badge="App"
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">
          {APP_NAME} <span className="text-muted-foreground">{version}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Released under the MIT licence.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Fully offline: no telemetry, no network access, and your vault never
          leaves this device. The GitHub button below opens in your browser; the
          app itself makes no network requests.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="default"
          onClick={(): void => {
            handleOpenLink(GITHUB_URL);
          }}
        >
          GitHub
          <ExternalLinkIcon className="size-4" />
        </Button>
      </div>
    </SettingsSection>
  );
}
