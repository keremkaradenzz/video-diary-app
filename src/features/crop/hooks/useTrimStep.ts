import { router } from 'expo-router';

import { CLIP_SECONDS } from '@/shared/constants';
import { useFilmstrip } from '@/features/crop/data/queries';
import { useCropStore } from '@/features/crop/data/store';
import { useClipPlayer } from '@/shared/hooks/useClipPlayer';

import { useRequireSource } from './useRequireSource';

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
    onNext: () => router.push('/crop/metadata'),
    onBack: () => router.back(),
  };
}
