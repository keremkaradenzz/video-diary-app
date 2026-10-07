import { useQuery } from '@tanstack/react-query';

import { getVideo } from '@/db/videos';
import { videoKeys } from '@/query/keys';

export const useVideo = (id: number) =>
  useQuery({ queryKey: videoKeys.one(id), queryFn: () => getVideo(id) });
