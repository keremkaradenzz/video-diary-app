import { router } from 'expo-router';

import type { Video } from '@/types/video';
import { CLIP_SECONDS } from '@/constants/config';
import { useClipPlayer } from '@/hooks/use-clip-player';

import { useConfirmDelete } from './use-confirm-delete';

/** `video` may still be loading; the player is created with no source until it arrives. */
export function useVideoDetails(video: Video | undefined) {
  const player = useClipPlayer(video?.uri);
  const { onDelete, isDeleting } = useConfirmDelete(video);
  return {
    player,
    clipSeconds: CLIP_SECONDS,
    isDeleting,
    onBack: () => router.back(),
    onEdit: () => video && router.push({ pathname: '/videos/[id]/edit', params: { id: video.id } }),
    onDelete,
  };
}
