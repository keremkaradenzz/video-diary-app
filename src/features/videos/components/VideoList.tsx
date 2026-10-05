import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Feedback';
import type { Video } from '@/features/videos/schema';

import { VideoListItem } from './VideoListItem';

type Props = {
  videos: Video[];
  onSelect: (id: number) => void;
  onCreate: () => void;
};

export function VideoList({ videos, onSelect, onCreate }: Props) {
  return (
    <View className="flex-1">
      <FlashList
        data={videos}
        keyExtractor={(v) => String(v.id)}
        contentContainerClassName="p-4"
        ListEmptyComponent={<Notice text="No videos yet." />}
        renderItem={({ item, index }) => (
          <VideoListItem video={item} index={index} onPress={() => onSelect(item.id)} />
        )}
      />
      <View className="absolute bottom-8 right-6">
        <Button label="New video" onPress={onCreate} />
      </View>
    </View>
  );
}
