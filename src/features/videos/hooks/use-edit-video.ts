import { router } from 'expo-router';

import { useUpdateMetadata } from '@/features/videos/api/queries';
import type { Video } from '@/features/videos/model/types';

import { useMetadataForm } from './use-metadata-form';

export function useEditVideo(video: Video) {
  const update = useUpdateMetadata(video.id);
  const form = useMetadataForm({ name: video.name, description: video.description }, (m) =>
    update.mutate(m, { onSuccess: () => router.back() }),
  );
  return {
    form,
    onBack: () => router.back(),
    isLoading: update.isPending,
    error: update.error?.message ?? null,
  };
}
