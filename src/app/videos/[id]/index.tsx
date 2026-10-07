import { useLocalSearchParams } from 'expo-router';

import { VideoDetails } from '@/screens/video-details';

export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <VideoDetails id={Number(id)} />;
}
