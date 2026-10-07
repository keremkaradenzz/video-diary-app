import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { updateMetadata } from '@/db/videos';
import { videoKeys } from '@/query/keys';
import type { Metadata } from '@/utils/video-schema';
import type { Video } from '@/types/video';

export function useUpdateMetadata(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (m: Metadata) => updateMetadata(id, m),
    // Patch the cached copies in place; no row moves, so nothing needs refetching.
    onSuccess: (_, m) => {
      const patch = (v: Video) => (v.id === id ? { ...v, ...m } : v);
      qc.setQueryData<Video | null>(videoKeys.one(id), (v) => v && patch(v));
      qc.setQueryData<InfiniteData<Video[]>>(
        videoKeys.list,
        (d) => d && { ...d, pages: d.pages.map((page) => page.map(patch)) },
      );
    },
  });
}
