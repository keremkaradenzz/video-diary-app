import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Loader } from '@/components/loader';
import { Notice } from '@/components/notice';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { VideoPlayer } from '@/components/video-player';
import { useVideo } from '@/hooks/use-video';
import { formatDateTime } from '@/utils/format-date';

import { useVideoDetails } from './hooks/use-video-details';

export function VideoDetails({ id }: { id: number }) {
  const { t } = useTranslation();
  const { data: video, isPending } = useVideo(id);
  const { player, clipSeconds, isDeleting, onEdit, onDelete, onBack } = useVideoDetails(video ?? undefined);
  if (isPending) return <Loader />;
  if (!video) return <Notice text={t('common.notFound')} />;
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

const styles = {
  scroll: 'gap-2 px-4 pt-2',
  player: 'mb-3 overflow-hidden rounded-2xl',
  badge: 'absolute bottom-3 right-3 z-10 rounded-lg bg-slate-900/80 px-2 py-1',
  badgeText: 'text-xs font-semibold text-white',
  title: 'text-2xl font-extrabold text-slate-900',
  meta: 'text-sm text-slate-600',
  description: 'mt-2 text-base leading-6 text-slate-700',
  bar: 'gap-3 px-4 pb-3 pt-2',
};
