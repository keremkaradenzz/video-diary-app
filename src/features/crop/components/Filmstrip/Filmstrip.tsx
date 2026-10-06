import { Image } from 'expo-image';
import type { VideoThumbnail } from 'expo-video';
import { StyleSheet, View } from 'react-native';

import { styles } from './Filmstrip.styles';

type Props = {
  frames: VideoThumbnail[];
  duration: number;
  start: number;
  clipLength: number;
};

const FALLBACK_FRAMES = 6;
const pct = (n: number) => `${Math.min(Math.max(n, 0), 100)}%` as const;

/** Frame strip with the selected window highlighted and the rest dimmed. */
export function Filmstrip({ frames, duration, start, clipLength }: Props) {
  const from = duration > 0 ? (start / duration) * 100 : 0;
  const size = duration > 0 ? (clipLength / duration) * 100 : 100;
  return (
    <View
      className={styles.strip}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {(frames.length ? frames : Array.from<VideoThumbnail | undefined>({ length: FALLBACK_FRAMES })).map(
        (frame, i) => (
          <View key={i} className={styles.frame}>
            {frame && <Image source={frame} style={StyleSheet.absoluteFill} contentFit="cover" />}
          </View>
        ),
      )}
      <View className={styles.dim} style={{ left: 0, width: pct(from) }} />
      <View className={styles.dim} style={{ right: 0, width: pct(100 - from - size) }} />
      <View className={styles.window} style={{ left: pct(from), width: pct(size) }} />
    </View>
  );
}
