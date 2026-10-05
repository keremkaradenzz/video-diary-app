import { Pressable, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { Video } from '@/features/videos/schema';

type Props = { video: Video; index: number; onPress: () => void };

export function VideoListItem({ video, index, onPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40)}>
      <Pressable onPress={onPress} className="mb-3 rounded-lg border border-gray-200 p-4 active:opacity-70">
        <Text className="text-base font-semibold">{video.name}</Text>
        {!!video.description && (
          <Text numberOfLines={2} className="mt-1 text-gray-600">
            {video.description}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
