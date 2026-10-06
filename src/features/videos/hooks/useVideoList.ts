import { router } from 'expo-router';

import { CLIP_SECONDS } from '@/shared/constants';
import { useThumbnails, useVideos } from '@/features/videos/data/queries';

export function useVideoList() {
  const { data, isPending } = useVideos();
  const videos = data ?? [];
  const thumbnails = useThumbnails(videos);
  return {
    videos,
    thumbnails,
    isLoading: isPending,
    onSelect: (id: number) => router.push({ pathname: '/videos/[id]', params: { id } }),
    clipSeconds: CLIP_SECONDS,
    onCreate: () => router.push('/crop'),
  };
}
