import { router } from 'expo-router';
import { useState } from 'react';

import { useFilmstrip } from '@/features/crop/api/queries';
import { useCropStore } from '@/features/crop/model/store';
import { CLIP_SECONDS } from '@/core/config';
import { useClipPlayer } from '@/shared/media/hooks/useClipPlayer';

import { useRequireSource } from './useRequireSource';

export function useTrimStep() {
  const sourceUri = useRequireSource();
  const duration = useCropStore((s) => s.duration);
  const committedStart = useCropStore((s) => s.startSec);
  const setStart = useCropStore((s) => s.setStart);
  // While the slider is dragged only this local value changes (labels, filmstrip window).
  // The store and the preview player follow once, when the finger lifts.
  const [draft, setDraft] = useState<number | null>(null);
  const filmstrip = useFilmstrip(sourceUri, duration);
  const player = useClipPlayer(sourceUri, { start: committedStart, length: CLIP_SECONDS });

  return {
    ready: !!sourceUri,
    player,
    frames: filmstrip.data ?? [],
    duration,
    startSec: draft ?? committedStart,
    clipLength: CLIP_SECONDS,
    onChangeStart: setDraft,
    onCommitStart: (start: number) => {
      setStart(start);
      setDraft(null);
    },
    onNext: () => router.push('/crop/metadata'),
    onBack: () => router.back(),
  };
}
