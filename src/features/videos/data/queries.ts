import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { VideoThumbnail } from 'expo-video';

import { generateThumbnails } from '@/shared/utils/thumbnails';

import { countVideos, getVideo, insertVideo, listVideos, PAGE_SIZE, updateMetadata } from './repo';
import type { Metadata } from './schema';
import type { Video } from './types';

const keys = {
  all: ['videos'] as const,
  list: ['videos', 'list'] as const,
  count: ['videos', 'count'] as const,
  one: (id: number) => ['videos', id] as const,
};

// Module-level so React Query can memoise the flattened result between renders.
const flatten = (data: { pages: Video[][] }) => data.pages.flat();

/** Clips newest first, loaded one page at a time (`fetchNextPage` on scroll). */
export const useVideos = () =>
  useInfiniteQuery({
    queryKey: keys.list,
    queryFn: ({ pageParam }) => listVideos(pageParam),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => (last.length === PAGE_SIZE ? pages.length * PAGE_SIZE : undefined),
    select: flatten,
  });

export const useVideoCount = () => useQuery({ queryKey: keys.count, queryFn: countVideos });

export const useVideo = (id: number) => useQuery({ queryKey: keys.one(id), queryFn: () => getVideo(id) });

export function useSaveVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: insertVideo,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateMetadata(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (m: Metadata) => updateMetadata(id, m),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

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
        thumbnail: (await generateThumbnails(v.uri, [0]))[0] ?? null,
      }),
    })),
    combine: toThumbnailMap,
  });
}
