import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';

import { MetadataForm } from '@/components/MetadataForm';
import { useUpdateMetadata, useVideo } from '@/features/videos/queries';

export default function EditVideo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const videoId = Number(id);
  const { data, isPending } = useVideo(videoId);
  const update = useUpdateMetadata(videoId);

  if (isPending) return <ActivityIndicator className="flex-1" />;
  if (!data) return <Text className="mt-20 text-center">Video not found.</Text>;

  return (
    <MetadataForm
      initial={{ name: data.name, description: data.description }}
      submitLabel="Save"
      loading={update.isPending}
      error={update.error?.message}
      onSubmit={(m) => update.mutate(m, { onSuccess: () => router.back() })}
    />
  );
}
