import type { ViewToken } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';

import { CLIP_SECONDS } from '@/constants/config';
import { useThumbnails } from '@/hooks/use-thumbnails';
import { useVideoCount } from '@/hooks/use-video-count';
import { useVideos } from '@/hooks/use-videos';
import type { Video } from '@/types/video';

export function useVideoList() {
  const { data, isPending, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useVideos();
  const { data: total = 0 } = useVideoCount();
  const videos = data ?? [];
  const [seenIds, setSeenIds] = useState<ReadonlySet<number>>(new Set());
  const thumbnails = useThumbnails(videos, seenIds);

  return {
    videos,
    total,
    thumbnails,
    isLoading: isPending,
    error: error?.message ?? null,
    onSelect: (id: number) => router.push({ pathname: '/videos/[id]', params: { id } }),
    onEndReached: () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    },
    onViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken<Video>[] }) =>
      setSeenIds((seen) => {
        const ids = viewableItems.flatMap((v) => (v.item && !seen.has(v.item.id) ? [v.item.id] : []));
        return ids.length ? new Set([...seen, ...ids]) : seen;
      }),
    clipSeconds: CLIP_SECONDS,
    onCreate: () => router.push('/crop'),
  };
}
