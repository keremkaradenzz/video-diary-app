import type { VideoThumbnail } from 'expo-video';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ClipThumbnail } from '@/shared/media/ui/ClipThumbnail';
import { formatDate } from '@/shared/utils/formatDate';
import type { Video } from '@/features/videos/model/types';

import { styles } from './VideoListItem.styles';

type Props = {
  video: Video;
  thumbnail?: VideoThumbnail;
  index: number;
  duration: string;
  onPress: () => void;
};

export function VideoListItem({ video, thumbnail, index, duration, onPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40)}>
      <Pressable onPress={onPress} accessibilityRole="button" className={styles.card}>
        <ClipThumbnail thumbnail={thumbnail} duration={duration} seed={video.id} />
        <View className={styles.body}>
          <Text numberOfLines={1} className={styles.title}>
            {video.name}
          </Text>
          {!!video.description && (
            <Text numberOfLines={2} className={styles.description}>
              {video.description}
            </Text>
          )}
          <Text className={styles.date}>{formatDate(video.createdAt)}</Text>
        </View>
        <Text className={styles.chevron}>›</Text>
      </Pressable>
    </Animated.View>
  );
}
