import type { VideoThumbnail } from 'expo-video';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ClipThumbnail } from '@/components/clip-thumbnail';
import { formatDate } from '@/utils/format-date';
import type { Video } from '@/types/video';

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

const styles = {
  card: 'mb-3 flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 active:opacity-70',
  body: 'flex-1 gap-1',
  title: 'text-base font-bold text-slate-900',
  description: 'text-sm text-slate-600',
  date: 'text-xs text-slate-600',
  chevron: 'pr-1 text-2xl text-surface0',
};
