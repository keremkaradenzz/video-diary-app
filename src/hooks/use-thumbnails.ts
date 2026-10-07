import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import type { VideoThumbnail } from 'expo-video';

import type { Video } from '@/types/video';
import { fileName } from '@/utils/files';
import { cachedThumbnail } from '@/utils/thumbnails';

type ThumbnailResult = { id: number; thumbnail: VideoThumbnail | null };

// Defined once so the combined map keeps its identity while no thumbnail changed.
const toThumbnailMap = (results: UseQueryResult<ThumbnailResult>[]) =>
  Object.fromEntries(results.flatMap((r) => (r.data ? [[r.data.id, r.data.thumbnail]] : [])));

/**
 * First frame of each clip by video id. Queries exist only for rows that have been on screen
 * (`seenIds`), so a long list neither decodes every video nor builds a query per loaded row.
 */
export function useThumbnails(videos: Video[], seenIds: ReadonlySet<number>) {
  return useQueries({
    queries: videos
      .filter((v) => seenIds.has(v.id))
      .map((v) => ({
        queryKey: ['thumbnail', v.uri],
        staleTime: Infinity,
        queryFn: async (): Promise<ThumbnailResult> => ({
          id: v.id,
          thumbnail: await cachedThumbnail(`clip-thumb:${fileName(v.uri)}`, v.uri),
        }),
      })),
    combine: toThumbnailMap,
  });
}
