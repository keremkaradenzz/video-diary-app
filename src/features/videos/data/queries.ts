import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

import { getVideo, insertVideo, listVideos, updateMetadata } from './repo';
import type { Metadata } from './schema';
import type { Video } from './types';
import { generateThumbnails } from '@/shared/utils/thumbnails';

const keys = { all: ['videos'] as const, one: (id: number) => ['videos', id] as const };

export const useVideos = () => useQuery({ queryKey: keys.all, queryFn: listVideos });

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

/** First frame of every clip by video id; `undefined` until generated (or if it failed). */
export function useThumbnails(videos: Video[]) {
  const results = useQueries({
    queries: videos.map((v) => ({
      queryKey: ['thumbnail', v.uri],
      staleTime: Infinity,
      queryFn: async () => (await generateThumbnails(v.uri, [0]))[0],
    })),
  });
  return Object.fromEntries(videos.map((v, i) => [v.id, results[i].data]));
}
