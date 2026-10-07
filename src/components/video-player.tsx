import { useEvent } from 'expo';
import { VideoView, type VideoPlayer as Player } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

type Props = {
  player: Player;
  height?: number;
};

/** Presentational: renders a player created by `useClipPlayer`. Tap toggles play/pause. */
export function VideoPlayer({ player, height = 240 }: Props) {
  const { t } = useTranslation();
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  return (
    <Pressable
      onPress={() => (isPlaying ? player.pause() : player.play())}
      accessibilityRole="button"
      accessibilityLabel={t(isPlaying ? 'common.pause' : 'common.play')}
    >
      <VideoView
        player={player}
        style={{ width: '100%', height, backgroundColor: '#000' }}
        nativeControls={false}
        contentFit="contain"
      />
      {!isPlaying && (
        <View className={styles.overlay} pointerEvents="none">
          <View className={styles.circle}>
            <Text className={styles.icon}>▶</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = {
  overlay: 'absolute inset-0 z-10 items-center justify-center',
  circle: 'h-16 w-16 items-center justify-center rounded-full bg-slate-900/55',
  icon: 'pl-1 text-3xl text-white',
};
