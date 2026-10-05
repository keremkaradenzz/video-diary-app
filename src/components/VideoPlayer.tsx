import { VideoView, type VideoPlayer as Player } from 'expo-video';

type Props = {
  player: Player;
  className?: string;
};

/** Presentational: renders a player created by `useClipPlayer`. */
export function VideoPlayer({ player, className = 'h-72 w-full bg-black' }: Props) {
  return <VideoView player={player} className={className} nativeControls contentFit="contain" />;
}
