import { useMutation } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';

import { CLIP_SECONDS } from './constants';

const TRIM_UNAVAILABLE = 'TRIM_UNAVAILABLE';

/** True when trimming failed because the native module is missing (for example in Expo Go). */
export const isTrimUnavailable = (error: unknown) =>
  typeof error === 'object' && error !== null && (error as { code?: string }).code === TRIM_UNAVAILABLE;

// expo-trim-video throws while it is imported if its native module is missing. Requiring it on
// demand keeps that from crashing the whole app at startup (Expo Go has no such module).
// Only that specific failure is translated; any other error is rethrown untouched.
function loadTrimVideo() {
  try {
    return (require('expo-trim-video') as typeof import('expo-trim-video')).trimVideo;
  } catch (error) {
    if (/Cannot find native module/i.test(String((error as Error)?.message))) {
      throw Object.assign(new Error('expo-trim-video native module is not available'), {
        code: TRIM_UNAVAILABLE,
      });
    }
    throw error;
  }
}

/** Trims the clip, then moves it from the temp location into the app's document directory. */
export const useTrimVideo = () =>
  useMutation({
    mutationFn: async ({ uri, start }: { uri: string; start: number }) => {
      const trimVideo = loadTrimVideo();
      const { uri: tmp } = await trimVideo({ uri, start, end: start + CLIP_SECONDS });
      const dest = new File(Paths.document, `clip-${Date.now()}.mp4`);
      new File(tmp).copy(dest);
      return { uri: dest.uri };
    },
  });
