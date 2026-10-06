import type { VideoPlayer as Player } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/shared/components/Button';
import { Screen } from '@/shared/components/Screen';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { VideoPlayer } from '@/shared/components/VideoPlayer';
import type { Video } from '@/features/videos/data/types';

import { styles } from './videoDetails.styles';

type Props = {
  video: Video;
  player: Player;
  clipSeconds: number;
  onEdit: () => void;
  onBack: () => void;
};

export function VideoDetails({ video, player, clipSeconds, onEdit, onBack }: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <ScreenHeader onBack={onBack} />
      <ScrollView contentContainerClassName={styles.scroll}>
        <View className={styles.player}>
          <VideoPlayer player={player} />
          <View className={styles.badge} pointerEvents="none">
            <Text className={styles.badgeText}>{`0:${String(clipSeconds).padStart(2, '0')}`}</Text>
          </View>
        </View>
        <Text className={styles.title}>{video.name}</Text>
        <Text className={styles.meta}>
          {t('details.meta', {
            date: new Date(video.createdAt).toLocaleString(),
            seconds: clipSeconds,
          })}
        </Text>
        {!!video.description && <Text className={styles.description}>{video.description}</Text>}
      </ScrollView>
      <View className={styles.bar}>
        <Button variant="secondary" label={t('details.edit')} onPress={onEdit} />
      </View>
    </Screen>
  );
}
