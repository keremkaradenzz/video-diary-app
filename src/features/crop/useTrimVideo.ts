import { useMutation } from '@tanstack/react-query';
import { trimVideo } from 'expo-trim-video';
import { File, Paths } from 'expo-file-system';

import { CLIP_SECONDS } from '@/features/videos/schema';

/** Trims the clip, then moves it from the temp location into the app's document directory. */
export const useTrimVideo = () =>
  useMutation({
    mutationFn: async ({ uri, start }: { uri: string; start: number }) => {
      const { uri: tmp } = await trimVideo({ uri, start, end: start + CLIP_SECONDS });
      const dest = new File(Paths.document, `clip-${Date.now()}.mp4`);
      new File(tmp).copy(dest);
      return { uri: dest.uri };
    },
  });
