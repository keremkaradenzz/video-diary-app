import { useQuery } from '@tanstack/react-query';

import { countVideos } from '@/db/videos';
import { videoKeys } from '@/query/keys';

export const useVideoCount = () => useQuery({ queryKey: videoKeys.count, queryFn: countVideos });
