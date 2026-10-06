import { Image } from 'expo-image';
import type { VideoThumbnail } from 'expo-video';
import { StyleSheet, Text, View } from 'react-native';

import { styles, tones } from './clip-thumbnail.styles';

type Props = {
  thumbnail?: VideoThumbnail;
  /** Formatted length, for example `0:05`. */
  duration: string;
  /** Picks the fallback colour while there is no thumbnail. */
  seed?: number;
};

export function ClipThumbnail({ thumbnail, duration, seed = 0 }: Props) {
  return (
    <View className={`${styles.tile} ${tones[seed % tones.length]}`}>
      {thumbnail ? (
        <Image source={thumbnail} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <Text className={styles.play}>▶</Text>
      )}
      <View className={styles.badge}>
        <Text className={styles.badgeText}>{duration}</Text>
      </View>
    </View>
  );
}
