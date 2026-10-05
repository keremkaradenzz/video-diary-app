import { Link, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { VideoPlayer } from '@/components/VideoPlayer';
import { useVideo } from '@/features/videos/queries';

export default function VideoDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending } = useVideo(Number(id));

  if (isPending) return <ActivityIndicator className="flex-1" />;
  if (!data) return <Text className="mt-20 text-center">Video not found.</Text>;

  return (
    <ScrollView>
      <VideoPlayer uri={data.uri} />
      <View className="gap-2 p-4">
        <Text className="text-2xl font-bold">{data.name}</Text>
        {!!data.description && <Text className="text-base text-gray-700">{data.description}</Text>}
        <Link href={{ pathname: '/edit/[id]', params: { id: data.id } }} className="mt-4 text-blue-600">
          Edit
        </Link>
      </View>
    </ScrollView>
  );
}
