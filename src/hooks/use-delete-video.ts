import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { deleteVideo } from '@/db/videos';
import { videoKeys } from '@/query/keys';
import type { Video } from '@/types/video';
import { deleteFile } from '@/utils/files';

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (video: Video) => {
      await deleteVideo(video.id);
      // After the row: a leftover file is harmless, a row pointing at a missing file is not.
      deleteFile(video.uri);
    },
    // The list keeps its cursors valid, so dropping the row in place is enough. The detail entry is left
    // alone: the screen is about to close, and clearing it would flash "not found" first.
    onSuccess: (_, video) => {
      qc.setQueryData<InfiniteData<Video[]>>(
        videoKeys.list,
        (d) => d && { ...d, pages: d.pages.map((page) => page.filter((v) => v.id !== video.id)) },
      );
      return qc.invalidateQueries({ queryKey: videoKeys.count });
    },
  });
}
