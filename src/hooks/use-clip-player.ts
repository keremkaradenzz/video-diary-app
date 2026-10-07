import { useVideoPlayer, type VideoPlayer } from 'expo-video';
import { useEffect } from 'react';

type Clip = { start: number; length: number };

// The native player is an external mutable object, so seeking is a plain imperative call.
function seekTo(player: VideoPlayer, time: number) {
  player.currentTime = time;
}

/** Creates a looping player. With `clip`, only that window is looped and it follows `clip.start`. */
export function useClipPlayer(uri: string | null | undefined, clip?: Clip) {
  const player = useVideoPlayer(uri ?? null, (p) => {
    p.loop = true;
    p.timeUpdateEventInterval = 0.2;
    p.play();
  });

  const start = clip?.start;
  const length = clip?.length;
  useEffect(() => {
    if (start === undefined || length === undefined) return;
    seekTo(player, start);
    const sub = player.addListener('timeUpdate', ({ currentTime }) => {
      if (currentTime >= start + length || currentTime < start - 0.5) {
        seekTo(player, start);
      }
    });
    return () => sub.remove();
  }, [player, start, length]);

  return player;
}
