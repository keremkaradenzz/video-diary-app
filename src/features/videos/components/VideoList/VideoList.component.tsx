import { FlashList } from '@shopify/flash-list';
import type { VideoThumbnail } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/shared/components/Button';
import { Screen } from '@/shared/components/Screen';
import { VideoListItem } from '@/features/videos/components/VideoListItem';
import type { Video } from '@/features/videos/data/types';

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
  return (
    <Screen>
      <FlashList
        data={videos}
        maintainVisibleContentPosition={{ disabled: true }}
        extraData={thumbnails}
        keyExtractor={(v) => String(v.id)}
        contentContainerClassName={styles.content}
        ListHeaderComponent={
          <View className={styles.header}>
            <Text className={styles.title}>{t('home.title')}</Text>
            {videos.length > 0 && (
              <Text className={styles.summary}>
                {t('home.summary', {
                  count: videos.length,
                  seconds: videos.length * clipSeconds,
                })}
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
          <VideoListItem
            video={item}
            index={index}
            thumbnail={thumbnails[item.id]}
            duration={`0:${String(clipSeconds).padStart(2, '0')}`}
            onPress={() => onSelect(item.id)}
          />
        )}
      />
      <View className={styles.bar}>
        <Button label={t('home.newVideo')} onPress={onCreate} />
      </View>
    </Screen>
  );
}
