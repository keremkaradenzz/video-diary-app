import { router } from 'expo-router';

import { useUpdateMetadata } from '@/features/videos/data/queries';
import type { Video } from '@/features/videos/data/types';

import { useMetadataForm } from './useMetadataForm';

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
