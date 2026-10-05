import { useVideoPlayer, VideoView, type VideoPlayer as Player } from 'expo-video';
import { useEffect } from 'react';

type Props = {
  uri: string;
  /** Called once on mount; use it to loop a window, listen to events, etc. */
  onReady?: (player: Player) => void;
  className?: string;
};

export function VideoPlayer({ uri, onReady, className = 'h-72 w-full bg-black' }: Props) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    onReady?.(player);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  return <VideoView player={player} className={className} nativeControls contentFit="contain" />;
}
