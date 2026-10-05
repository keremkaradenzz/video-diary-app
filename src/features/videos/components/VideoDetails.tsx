import type { VideoPlayer as Player } from 'expo-video';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { Video } from '@/features/videos/schema';

type Props = { video: Video; player: Player; onEdit: () => void };

export function VideoDetails({ video, player, onEdit }: Props) {
  return (
    <ScrollView>
      <VideoPlayer player={player} />
      <View className="gap-2 p-4">
        <Text className="text-2xl font-bold">{video.name}</Text>
        {!!video.description && <Text className="text-base text-gray-700">{video.description}</Text>}
        <View className="mt-4">
          <Button label="Edit" onPress={onEdit} />
        </View>
      </View>
    </ScrollView>
  );
}
