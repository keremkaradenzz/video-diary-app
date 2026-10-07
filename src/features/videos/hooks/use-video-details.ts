import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { CLIP_SECONDS } from '@/core/config';
import { useDeleteVideo } from '@/features/videos/api/queries';
import type { Video } from '@/features/videos/model/types';
import { useClipPlayer } from '@/shared/media/hooks/use-clip-player';

/** `video` may still be loading; the player is created with no source until it arrives. */
export function useVideoDetails(video: Video | undefined) {
  const { t } = useTranslation();
  const player = useClipPlayer(video?.uri);
  const remove = useDeleteVideo();

  const confirmDelete = () =>
    video &&
    Alert.alert(t('details.deleteTitle'), t('details.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('details.delete'),
        style: 'destructive',
        onPress: () =>
          remove.mutate(video, {
            onSuccess: () => router.back(),
            onError: () => Alert.alert(t('details.deleteFailed')),
          }),
      },
    ]);

  return {
    player,
    clipSeconds: CLIP_SECONDS,
    isDeleting: remove.isPending,
    onBack: () => router.back(),
    onEdit: () => video && router.push({ pathname: '/videos/[id]/edit', params: { id: video.id } }),
    onDelete: confirmDelete,
  };
}
