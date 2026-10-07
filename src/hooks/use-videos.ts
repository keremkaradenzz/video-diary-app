import { useInfiniteQuery } from '@tanstack/react-query';

import { listVideos, PAGE_SIZE, toCursor, type Cursor } from '@/db/videos';
import { videoKeys } from '@/query/keys';
import type { Video } from '@/types/video';

// Module-level so React Query can memoise the flattened result between renders.
const flatten = (data: { pages: Video[][] }) => data.pages.flat();

/** Clips newest first, loaded one page at a time (`fetchNextPage` on scroll). */
export const useVideos = () =>
  useInfiniteQuery({
    queryKey: videoKeys.list,
    queryFn: ({ pageParam }) => listVideos(pageParam),
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (last) => (last.length === PAGE_SIZE ? toCursor(last[last.length - 1]) : undefined),
    select: flatten,
  });
