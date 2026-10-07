import { useMutation, useQueryClient } from '@tanstack/react-query';

import { insertVideo } from '@/db/videos';
import { videoKeys } from '@/query/keys';

export function useSaveVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: insertVideo,
    // The new clip lands at the top of the list: reset to the first page instead of refetching every loaded page.
    onSuccess: () =>
      Promise.all([
        qc.resetQueries({ queryKey: videoKeys.list }),
        qc.invalidateQueries({ queryKey: videoKeys.count }),
      ]),
  });
}
