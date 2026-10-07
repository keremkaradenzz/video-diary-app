import { useQuery } from '@tanstack/react-query';

import { generateThumbnails } from '@/utils/thumbnails';

const FRAMES = 6;

/** Evenly spaced frames across the source video, for the trim strip. */
export const useFilmstrip = (uri: string | null, duration: number) =>
  useQuery({
    queryKey: ['filmstrip', uri, duration],
    enabled: !!uri && duration > 0,
    staleTime: Infinity,
    queryFn: () =>
      generateThumbnails(
        uri!,
        Array.from({ length: FRAMES }, (_, i) => ((i + 0.5) * duration) / FRAMES),
        160,
      ),
  });
