//src/features/home/hooks/use-blob-companion.ts
import { useRef, useState } from "react";

export type BlobMood =
  | "neutral"
  | "happy"
  | "password"
  | "curious"
  | "hmm"
  | "sad"
  | "surprised"
  | "sideEye";

export interface BlobGaze {
  readonly x: number;
  readonly y: number;
  readonly intensity: number;
}

export interface BlobCompanion {
  readonly blobMood: BlobMood;
  readonly setBlobMood: (mood: BlobMood) => void;
  readonly blobGaze: BlobGaze;
  readonly setBlobGaze: (gaze: BlobGaze) => void;
  readonly blobNod: boolean;
  readonly setBlobNod: (nod: boolean) => void;
  readonly blobPositionX: number;
  readonly setBlobPositionX: (x: number) => void;
  readonly blobPositionY: number;
  readonly setBlobPositionY: (y: number) => void;
  readonly blobMouth: "open" | "wide" | undefined;
  readonly triggerTalk: () => void;
  readonly resetBlob: () => void;
}

export function useBlobCompanion(): BlobCompanion {
  const [blobMood, setBlobMood] = useState<BlobMood>("neutral");
  const [blobGaze, setBlobGaze] = useState<BlobGaze>({
    x: 0,
    y: 0,
    intensity: 0,
  });
  const [blobNod, setBlobNod] = useState(false);
  const [blobPositionX, setBlobPositionX] = useState(0);
  const [blobPositionY, setBlobPositionY] = useState(0);
  const [blobMouth, setBlobMouth] = useState<"open" | "wide" | undefined>(
    undefined,
  );
  const mouthTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerTalk = (): void => {
    setBlobMouth("open");
    if (mouthTimeoutRef.current) {
      clearTimeout(mouthTimeoutRef.current);
    }
    mouthTimeoutRef.current = setTimeout(() => {
      setBlobMouth(undefined);
    }, 140);
  };

  const resetBlob = (): void => {
    if (mouthTimeoutRef.current) {
      clearTimeout(mouthTimeoutRef.current);
    }
    setBlobMouth(undefined);
    setBlobMood("neutral");
    setBlobGaze({ x: 0, y: 0, intensity: 0 });
    setBlobNod(false);
    setBlobPositionX(0);
    setBlobPositionY(0);
  };

  return {
    blobMood,
    setBlobMood,
    blobGaze,
    setBlobGaze,
    blobNod,
    setBlobNod,
    blobPositionX,
    setBlobPositionX,
    blobPositionY,
    setBlobPositionY,
    blobMouth,
    triggerTalk,
    resetBlob,
  };
}
