import { useQuery } from '@tanstack/react-query';

import { generateThumbnails } from '@/utils/thumbnails';

/** Frame at the start of the selected window, shown as the clip preview in the details step. */
export const useClipThumbnail = (uri: string | null, start: number) =>
  useQuery({
    queryKey: ['clip-thumbnail', uri, start],
    enabled: !!uri,
    staleTime: Infinity,
    queryFn: async () => (await generateThumbnails(uri!, [start], 240))[0] ?? null,
  });
