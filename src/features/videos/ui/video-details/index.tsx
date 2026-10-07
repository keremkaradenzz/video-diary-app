import type { VideoPlayer as Player } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { ScreenHeader } from '@/shared/ui/screen-header';
import { VideoPlayer } from '@/shared/media/ui/video-player';
import { formatDateTime } from '@/shared/utils/format-date';
import type { Video } from '@/features/videos/model/types';

import { styles } from './video-details.styles';

type Props = {
  video: Video;
  player: Player;
  clipSeconds: number;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export function VideoDetails({ video, player, clipSeconds, isDeleting, onEdit, onDelete, onBack }: Props) {
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
            date: formatDateTime(video.createdAt),
            seconds: clipSeconds,
          })}
        </Text>
        {!!video.description && <Text className={styles.description}>{video.description}</Text>}
      </ScrollView>
      <View className={styles.bar}>
        <Button variant="secondary" label={t('details.edit')} onPress={onEdit} disabled={isDeleting} />
        <Button variant="danger" label={t('details.delete')} onPress={onDelete} loading={isDeleting} />
      </View>
    </Screen>
  );
}
