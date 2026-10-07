import type { VideoThumbnail } from 'expo-video';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ClipThumbnail } from '@/components/clip-thumbnail';
import { formatDate } from '@/utils/format-date';
import type { Video } from '@/types/video';

// Only the first rows animate in; rows scrolled into view later just appear.
const ENTRY_ROWS = 8;

type Props = {
  video: Video;
  thumbnail?: VideoThumbnail;
  index: number;
  duration: string;
  onPress: (id: number) => void;
};

// Memoized (`export const` is allowed by the architecture test for this): a thumbnail arriving for one row must not re-render the others.
// The React Compiler does not cover this: FlashList re-runs `renderItem` for every visible row, which builds new elements.
export const VideoListItem = memo(function VideoListItem({
  video,
  thumbnail,
  index,
  duration,
  onPress,
}: Props) {
  return (
    <Animated.View entering={index < ENTRY_ROWS ? FadeInDown.delay(index * 40) : undefined}>
      <Pressable onPress={() => onPress(video.id)} accessibilityRole="button" className={styles.card}>
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
});

const styles = {
  card: 'mb-3 flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 active:opacity-70',
  body: 'flex-1 gap-1',
  title: 'text-base font-bold text-slate-900',
  description: 'text-sm text-slate-600',
  date: 'text-xs text-slate-600',
  chevron: 'pr-1 text-2xl text-surface0',
};
