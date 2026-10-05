import { VideoView, type VideoPlayer as Player } from 'expo-video';

import { styles } from './videoPlayer.styles';

type Props = {
  player: Player;
  className?: string;
};

/** Presentational: renders a player created by `useClipPlayer`. */
export function VideoPlayer({ player, className = styles.player }: Props) {
  return <VideoView player={player} className={className} nativeControls contentFit="contain" />;
}
