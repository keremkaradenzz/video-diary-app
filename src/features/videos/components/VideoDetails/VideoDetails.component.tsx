import type { VideoPlayer as Player } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { Video } from '@/features/videos/types';

import { styles } from './videoDetails.styles';

type Props = { video: Video; player: Player; clipSeconds: number; onEdit: () => void; onBack: () => void };

export function VideoDetails({ video, player, clipSeconds, onEdit, onBack }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View className={styles.container}>
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
          {t('details.meta', { date: new Date(video.createdAt).toLocaleString(), seconds: clipSeconds })}
        </Text>
        {!!video.description && <Text className={styles.description}>{video.description}</Text>}
      </ScrollView>
      <View className={styles.bar} style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button variant="secondary" label={t('details.edit')} onPress={onEdit} />
      </View>
    </View>
  );
}
