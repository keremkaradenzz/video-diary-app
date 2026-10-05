import { router } from 'expo-router';

import { useCropStore } from '@/features/crop/store';
import { useClipPlayer } from '@/features/videos/hooks/useClipPlayer';
import { CLIP_SECONDS } from '@/features/videos/schema';

import { useRequireSource } from './useRequireSource';

export function useTrimStep() {
  const sourceUri = useRequireSource();
  const duration = useCropStore((s) => s.duration);
  const startSec = useCropStore((s) => s.startSec);
  const setStart = useCropStore((s) => s.setStart);
  const player = useClipPlayer(sourceUri, { start: startSec, length: CLIP_SECONDS });

  return {
    ready: !!sourceUri,
    player,
    duration,
    startSec,
    clipLength: CLIP_SECONDS,
    onChangeStart: setStart,
    onNext: () => router.push('/crop/metadata'),
  };
}
