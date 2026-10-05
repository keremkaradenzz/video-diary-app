import { Pressable, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { Video } from '@/features/videos/types';

import { styles } from './videoListItem.styles';

type Props = { video: Video; index: number; onPress: () => void };

export function VideoListItem({ video, index, onPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40)}>
      <Pressable onPress={onPress} className={styles.card}>
        <Text className={styles.title}>{video.name}</Text>
        {!!video.description && (
          <Text numberOfLines={2} className={styles.description}>
            {video.description}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
