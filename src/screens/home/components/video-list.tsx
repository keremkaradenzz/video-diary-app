import { FlashList, type ViewToken } from '@shopify/flash-list';
import type { VideoThumbnail } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import type { Video } from '@/types/video';

import { VideoListItem } from './video-list-item';

type Props = {
  videos: Video[];
  /** Total number of saved clips, which can exceed the `videos` loaded so far. */
  total: number;
  thumbnails: Record<number, VideoThumbnail | null | undefined>;
  /** Length of every saved clip, in seconds. */
  clipSeconds: number;
  onSelect: (id: number) => void;
  onEndReached: () => void;
  onViewableItemsChanged: (info: { viewableItems: ViewToken<Video>[] }) => void;
  onCreate: () => void;
};

// A row counts as visible as soon as any part of it shows, so its frame starts loading early.
const VIEWABILITY = { itemVisiblePercentThreshold: 1 };

export function VideoList({
  videos,
  total,
  thumbnails,
  clipSeconds,
  onSelect,
  onEndReached,
  onViewableItemsChanged,
  onCreate,
}: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <FlashList
        data={videos}
        maintainVisibleContentPosition={{ disabled: true }}
        extraData={thumbnails}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY}
        keyExtractor={(v) => String(v.id)}
        contentContainerClassName={styles.content}
        ListHeaderComponent={
          <View className={styles.header}>
            <Text className={styles.title}>{t('home.title')}</Text>
            {total > 0 && (
              <Text className={styles.summary}>
                {t('home.summary', {
                  count: total,
                  seconds: total * clipSeconds,
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
            thumbnail={thumbnails[item.id] ?? undefined}
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

const styles = {
  container: 'flex-1',
  content: 'px-4',
  header: 'gap-1 pb-4 pt-4',
  title: 'text-3xl font-extrabold text-slate-900',
  summary: 'text-sm text-slate-600',
  bar: 'px-4 pb-3 pt-2',
  empty: 'items-center gap-1 pt-16',
  emptyTitle: 'text-lg font-bold text-slate-900',
  emptyHint: 'text-center text-sm text-slate-600',
};
