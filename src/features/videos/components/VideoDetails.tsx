import type { VideoPlayer as Player } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { Video } from '@/features/videos/types';

type Props = { video: Video; player: Player; onEdit: () => void };

export function VideoDetails({ video, player, onEdit }: Props) {
  const { t } = useTranslation();
  return (
    <ScrollView>
      <VideoPlayer player={player} />
      <View className="gap-2 p-4">
        <Text className="text-2xl font-bold">{video.name}</Text>
        {!!video.description && <Text className="text-base text-gray-700">{video.description}</Text>}
        <View className="mt-4">
          <Button label={t('details.edit')} onPress={onEdit} />
        </View>
      </View>
    </ScrollView>
  );
}
