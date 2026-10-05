import { Image } from 'expo-image';
import type { VideoThumbnail } from 'expo-video';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { Video } from '@/features/videos/types';

import { styles, tiles } from './videoListItem.styles';

type Props = { video: Video; thumbnail?: VideoThumbnail; index: number; duration: string; onPress: () => void };

export function VideoListItem({ video, thumbnail, index, duration, onPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40)}>
      <Pressable onPress={onPress} accessibilityRole="button" className={styles.card}>
        <View className={`${styles.tile} ${tiles[video.id % tiles.length]}`}>
          {thumbnail ? (
            <Image source={thumbnail} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <Text className={styles.play}>▶</Text>
          )}
          <View className={styles.badge}>
            <Text className={styles.badgeText}>{duration}</Text>
          </View>
        </View>
        <View className={styles.body}>
          <Text numberOfLines={1} className={styles.title}>
            {video.name}
          </Text>
          {!!video.description && (
            <Text numberOfLines={2} className={styles.description}>
              {video.description}
            </Text>
          )}
          <Text className={styles.date}>{new Date(video.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text className={styles.chevron}>›</Text>
      </Pressable>
    </Animated.View>
  );
}
