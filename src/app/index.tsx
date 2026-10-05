import { Loader } from '@/components/Loader';
import { VideoList } from '@/features/videos/components/VideoList';
import { useVideoList } from '@/features/videos/hooks/useVideoList';

export default function HomeScreen() {
  const { isLoading, ...view } = useVideoList();
  if (isLoading) return <Loader />;
  return <VideoList {...view} />;
}
