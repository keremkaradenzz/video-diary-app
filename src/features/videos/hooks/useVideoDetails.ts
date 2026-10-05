import { router } from 'expo-router';

import type { Video } from '@/features/videos/types';
import { useClipPlayer } from '@/hooks/useClipPlayer';

/** `video` may still be loading; the player is created with no source until it arrives. */
export function useVideoDetails(video: Video | undefined) {
  const player = useClipPlayer(video?.uri);
  return {
    player,
    onEdit: () => video && router.push({ pathname: '/videos/[id]/edit', params: { id: video.id } }),
  };
}
