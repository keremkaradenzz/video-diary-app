import { useMutation } from '@tanstack/react-query';
import { trimVideo } from 'expo-trim-video';

import { CLIP_SECONDS } from '@/features/videos/schema';

export const useTrimVideo = () =>
  useMutation({
    mutationFn: ({ uri, start }: { uri: string; start: number }) =>
      trimVideo({ uri, start, end: start + CLIP_SECONDS }),
  });
