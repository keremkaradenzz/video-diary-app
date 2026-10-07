import { Image, type ImageRef } from 'expo-image';
import { createVideoPlayer, type VideoThumbnail } from 'expo-video';

import { fileName } from '@/utils/files';

// One native player at a time: a long list must not open dozens of decoders at once.
let queue: Promise<unknown> = Promise.resolve();

async function generate(uri: string, times: number[], maxWidth: number): Promise<VideoThumbnail[]> {
  const player = createVideoPlayer(uri);
  try {
    if (player.status !== 'readyToPlay') {
      await new Promise<void>((resolve, reject) => {
        const sub = player.addListener('statusChange', ({ status, error }) => {
          if (status === 'readyToPlay') resolve();
          else if (status === 'error') reject(new Error(error?.message ?? 'Video failed to load'));
          else return;
          sub.remove();
        });
      });
    }
    return await player.generateThumbnailsAsync(times, { maxWidth });
  } finally {
    player.release();
  }
}

/** Frames of `uri` at the given seconds, generated one video at a time. */
export function generateThumbnails(uri: string, times: number[], maxWidth = 240) {
  const run = queue.then(() => generate(uri, times, maxWidth));
  queue = run.catch(() => undefined);
  return run;
}

/** Cache key of a saved clip's list thumbnail. The file name survives app container path changes. */
export const clipThumbKey = (uri: string) => `clip-thumb:${fileName(uri)}`;

/** Stores an already generated frame under `key`, so the next `cachedThumbnail(key, …)` is a hit. */
export const primeThumbnail = (key: string, thumb: VideoThumbnail) =>
  // Both are native image refs and are only ever used as an <Image source>.
  Image.writeToCacheAsync(thumb as unknown as ImageRef, key).catch(() => undefined);

/**
 * Like `generateThumbnails` for a single frame, but kept in expo-image's disk cache under `key`,
 * so a later launch reads it instead of decoding the video again. The cache may be evicted by the
 * OS; a miss simply regenerates the frame.
 */
export async function cachedThumbnail(key: string, uri: string, time = 0): Promise<VideoThumbnail | null> {
  const hit = await Image.readFromCacheAsync(key).catch(() => null);
  if (hit) return hit as unknown as VideoThumbnail;
  const [thumb] = await generateThumbnails(uri, [time]);
  if (thumb) await primeThumbnail(key, thumb);
  return thumb ?? null;
}
