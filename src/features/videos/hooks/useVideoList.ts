import { router } from 'expo-router';

import { useVideos } from '@/features/videos/queries';

export function useVideoList() {
  const { data, isPending } = useVideos();
  return {
    videos: data ?? [],
    isLoading: isPending,
    onSelect: (id: number) => router.push({ pathname: '/videos/[id]', params: { id } }),
    onCreate: () => router.push('/crop'),
  };
}
