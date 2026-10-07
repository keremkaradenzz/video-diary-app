import { router } from 'expo-router';

import { useMetadataForm } from '@/hooks/use-metadata-form';
import { useUpdateMetadata } from '@/hooks/use-update-metadata';
import type { Video } from '@/types/video';

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
