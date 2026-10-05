import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getVideo, insertVideo, listVideos, updateMetadata } from './repo';
import type { Metadata } from './schema';

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
