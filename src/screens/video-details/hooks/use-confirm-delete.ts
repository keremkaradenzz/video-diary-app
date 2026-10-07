import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useDeleteVideo } from '@/hooks/use-delete-video';
import type { Video } from '@/types/video';

/** Asks for confirmation, deletes the clip and leaves the screen it was opened from. */
export function useConfirmDelete(video: Video | undefined) {
  const { t } = useTranslation();
  const remove = useDeleteVideo();

  const onDelete = () =>
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

  return { onDelete, isDeleting: remove.isPending };
}
