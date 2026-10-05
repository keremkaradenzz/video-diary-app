import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { VideoListItem } from '@/features/videos/components/VideoListItem';
import type { Video } from '@/features/videos/types';

import { styles } from './videoList.styles';

type Props = {
  videos: Video[];
  onSelect: (id: number) => void;
  onCreate: () => void;
};

export function VideoList({ videos, onSelect, onCreate }: Props) {
  const { t } = useTranslation();
  return (
    <View className={styles.container}>
      <FlashList
        data={videos}
        keyExtractor={(v) => String(v.id)}
        contentContainerClassName={styles.content}
        ListEmptyComponent={<Notice text={t('home.empty')} />}
        renderItem={({ item, index }) => (
          <VideoListItem video={item} index={index} onPress={() => onSelect(item.id)} />
        )}
      />
      <View className={styles.fab}>
        <Button label={t('home.newVideo')} onPress={onCreate} />
      </View>
    </View>
  );
}
