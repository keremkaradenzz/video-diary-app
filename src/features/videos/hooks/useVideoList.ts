import type { ViewToken } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';

import { useThumbnails, useVideoCount, useVideos } from '@/features/videos/data/queries';
import type { Video } from '@/features/videos/data/types';
import { CLIP_SECONDS } from '@/shared/constants';

export function useVideoList() {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useVideos();
  const { data: total = 0 } = useVideoCount();
  const videos = data ?? [];
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const thumbnails = useThumbnails(videos, visibleIds);

  return {
    videos,
    total,
    thumbnails,
    isLoading: isPending,
    onSelect: (id: number) => router.push({ pathname: '/videos/[id]', params: { id } }),
    onEndReached: () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    },
    onViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken<Video>[] }) =>
      setVisibleIds(viewableItems.flatMap((v) => (v.item ? [v.item.id] : []))),
    clipSeconds: CLIP_SECONDS,
    onCreate: () => router.push('/crop'),
  };
}
