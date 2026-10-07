import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import type { VideoThumbnail } from 'expo-video';

import type { Video } from '@/types/video';
import { cachedThumbnail } from '@/utils/thumbnails';

type ThumbnailResult = { id: number; thumbnail: VideoThumbnail | null };

// Defined once so the combined map keeps its identity while no thumbnail changed.
const toThumbnailMap = (results: UseQueryResult<ThumbnailResult>[]) =>
  Object.fromEntries(results.flatMap((r) => (r.data ? [[r.data.id, r.data.thumbnail]] : [])));

/**
 * First frame of each clip by video id. Frames are generated only for the rows in `visibleIds`
 * (disabled queries still return what is already cached), so a long list does not decode every video.
 */
export function useThumbnails(videos: Video[], visibleIds: number[]) {
  return useQueries({
    queries: videos.map((v) => ({
      queryKey: ['thumbnail', v.uri],
      staleTime: Infinity,
      enabled: visibleIds.includes(v.id),
      queryFn: async (): Promise<ThumbnailResult> => ({
        id: v.id,
        thumbnail: await cachedThumbnail(`clip-thumb:${v.uri}`, v.uri),
      }),
    })),
    combine: toThumbnailMap,
  });
}
