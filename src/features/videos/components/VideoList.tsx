import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import type { Video } from '@/features/videos/types';

import { VideoListItem } from './VideoListItem';

type Props = {
  videos: Video[];
  onSelect: (id: number) => void;
  onCreate: () => void;
};

export function VideoList({ videos, onSelect, onCreate }: Props) {
  const { t } = useTranslation();
  return (
    <View className="flex-1">
      <FlashList
        data={videos}
        keyExtractor={(v) => String(v.id)}
        contentContainerClassName="p-4"
        ListEmptyComponent={<Notice text={t('home.empty')} />}
        renderItem={({ item, index }) => (
          <VideoListItem video={item} index={index} onPress={() => onSelect(item.id)} />
        )}
      />
      <View className="absolute bottom-8 right-6">
        <Button label={t('home.newVideo')} onPress={onCreate} />
      </View>
    </View>
  );
}
