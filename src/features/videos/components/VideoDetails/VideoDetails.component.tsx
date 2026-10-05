import type { VideoPlayer as Player } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { Video } from '@/features/videos/types';

import { styles } from './videoDetails.styles';

type Props = { video: Video; player: Player; onEdit: () => void };

export function VideoDetails({ video, player, onEdit }: Props) {
  const { t } = useTranslation();
  return (
    <ScrollView>
      <VideoPlayer player={player} />
      <View className={styles.content}>
        <Text className={styles.title}>{video.name}</Text>
        {!!video.description && <Text className={styles.description}>{video.description}</Text>}
        <View className={styles.actions}>
          <Button label={t('details.edit')} onPress={onEdit} />
        </View>
      </View>
    </ScrollView>
  );
}
