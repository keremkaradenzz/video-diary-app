import { Image } from 'expo-image';
import type { VideoThumbnail } from 'expo-video';
import { StyleSheet, Text, View } from 'react-native';

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

const styles = {
  tile: 'h-20 w-24 items-center justify-center overflow-hidden rounded-xl',
  play: 'text-2xl text-white',
  badge: 'absolute bottom-1.5 right-1.5 rounded-md bg-slate-900/80 px-1.5 py-0.5',
  badgeText: 'text-xs font-semibold text-white',
};

// Fallback tile colours, picked by `seed`, used until the real frame is available.
const tones = [
  'bg-indigo-500',
  'bg-sky-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-violet-600',
];
