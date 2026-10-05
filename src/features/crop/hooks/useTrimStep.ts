import { router } from "expo-router";

import { CLIP_SECONDS } from "@/features/crop/constants";
import { useFilmstrip } from "@/features/crop/queries";
import { useCropStore } from "@/features/crop/store";
import { useClipPlayer } from "@/hooks/useClipPlayer";

import { useRequireSource } from "./useRequireSource";

export function useTrimStep() {
  const sourceUri = useRequireSource();
  const duration = useCropStore((s) => s.duration);
  const startSec = useCropStore((s) => s.startSec);
  const setStart = useCropStore((s) => s.setStart);
  const filmstrip = useFilmstrip(sourceUri, duration);
  const player = useClipPlayer(sourceUri, {
    start: startSec,
    length: CLIP_SECONDS,
  });

  return {
    ready: !!sourceUri,
    player,
    frames: filmstrip.data ?? [],
    duration,
    startSec,
    clipLength: CLIP_SECONDS,
    onChangeStart: setStart,
    onNext: () => router.push("/crop/metadata"),
    onBack: () => router.back(),
  };
}
