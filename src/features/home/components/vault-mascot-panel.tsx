//src/features/home/components/vault-mascot-panel.tsx
import { JellyBlobMascot } from "feral-blob";
import "feral-blob/blob.css";
import type { BlobGaze, BlobMood } from "../hooks/use-blob-companion";

interface VaultMascotPanelProps {
  readonly mood: BlobMood;
  readonly gaze: BlobGaze;
  readonly nod: boolean;
  readonly mouth?: "open" | "wide";
  readonly positionX: number;
  readonly positionY: number;
  readonly onWake: () => void;
  readonly caption: string;
  readonly captionHidden: boolean;
}

const BLOB_STYLE = {
  "--jelly-body-top": "color-mix(in oklch, var(--primary) 35%, white)",
  "--jelly-body-mid": "color-mix(in oklch, var(--primary) 65%, white)",
  "--jelly-body-deep": "var(--primary)",
  "--jelly-body-rim": "color-mix(in oklch, var(--primary) 50%, white)",
  "--jelly-outline": "var(--primary)",
  "--jelly-outline-light": "color-mix(in oklch, var(--primary) 65%, white)",
  "--jelly-arm-light": "color-mix(in oklch, var(--primary) 40%, white)",
  "--jelly-arm-mid": "color-mix(in oklch, var(--primary) 70%, white)",
  "--jelly-arm-deep": "var(--primary)",
  "--jelly-cheek-light": "color-mix(in oklch, var(--primary) 25%, white)",
  "--jelly-cheek": "color-mix(in oklch, var(--primary) 45%, white)",
  "--jelly-cheek-deep": "color-mix(in oklch, var(--primary) 65%, white)",
  "--jelly-belly-glow": "color-mix(in oklch, var(--primary) 35%, white)",
  "--jelly-eye-sparkle": "color-mix(in oklch, var(--primary) 70%, white)",
} as React.CSSProperties;

export function VaultMascotPanel({
  mood,
  gaze,
  nod,
  mouth,
  positionX,
  positionY,
  onWake,
  caption,
  captionHidden,
}: VaultMascotPanelProps): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center bg-muted/30 p-6"
      style={BLOB_STYLE}
    >
      <div
        className="size-36 sm:size-44 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${String(positionX)}px, ${String(positionY)}px)`,
        }}
      >
        <JellyBlobMascot
          mood={mood}
          eyeStyle="v1"
          gaze={gaze}
          nod={nod}
          {...(mouth ? { mouth } : {})}
          onWake={onWake}
        />
      </div>
      <p
        className={`mt-4 text-center text-sm font-medium text-muted-foreground transition-opacity duration-200 ${
          captionHidden ? "opacity-0" : "opacity-100"
        }`}
      >
        {caption}
      </p>
    </div>
  );
}
