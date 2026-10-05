import type { VideoThumbnail } from 'expo-video';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { VideoListItem } from '@/features/videos/components/VideoListItem';
import type { Video } from '@/features/videos/types';

import { styles } from './videoList.styles';

type Props = {
  videos: Video[];
  thumbnails: Record<number, VideoThumbnail | undefined>;
  /** Length of every saved clip, in seconds. */
  clipSeconds: number;
  onSelect: (id: number) => void;
  onCreate: () => void;
};

export function VideoList({ videos, thumbnails, clipSeconds, onSelect, onCreate }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View className={styles.container}>
      <FlashList
        data={videos}
        extraData={thumbnails}
        keyExtractor={(v) => String(v.id)}
        contentContainerClassName={styles.content}
        ListHeaderComponent={
          <View className={styles.header} style={{ paddingTop: insets.top + 16 }}>
            <Text className={styles.title}>{t('home.title')}</Text>
            {videos.length > 0 && (
              <Text className={styles.summary}>
                {t('home.summary', { count: videos.length, seconds: videos.length * clipSeconds })}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className={styles.empty}>
            <Text className={styles.emptyTitle}>{t('home.empty')}</Text>
            <Text className={styles.emptyHint}>{t('home.emptyHint')}</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <VideoListItem video={item} index={index} thumbnail={thumbnails[item.id]} duration={`0:${String(clipSeconds).padStart(2, '0')}`} onPress={() => onSelect(item.id)} />
        )}
      />
      <View className={styles.bar} style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button label={t('home.newVideo')} onPress={onCreate} />
      </View>
    </View>
  );
}
