import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useVideos } from '@/features/videos/queries';

export default function Home() {
  const { data, isPending } = useVideos();

  if (isPending) return <ActivityIndicator className="flex-1" />;

  return (
    <View className="flex-1">
      <FlashList
        data={data}
        keyExtractor={(v) => String(v.id)}
        contentContainerClassName="p-4"
        ListEmptyComponent={<Text className="mt-20 text-center text-gray-500">No videos yet.</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/video/[id]', params: { id: item.id } })}
            className="mb-3 rounded-lg border border-gray-200 p-4 active:opacity-70">
            <Text className="text-base font-semibold">{item.name}</Text>
            {!!item.description && (
              <Text numberOfLines={2} className="mt-1 text-gray-600">
                {item.description}
              </Text>
            )}
          </Pressable>
        )}
      />
      <Pressable
        onPress={() => router.push('/crop')}
        className="absolute bottom-8 right-6 rounded-full bg-blue-600 px-6 py-4 active:opacity-80">
        <Text className="font-semibold text-white">New video</Text>
      </Pressable>
    </View>
  );
}
