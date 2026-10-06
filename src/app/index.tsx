import { Loader } from '@/shared/components/Loader';
import { Notice } from '@/shared/components/Notice';
import { VideoList } from '@/features/videos/components/VideoList';
import { useVideoList } from '@/features/videos/hooks/useVideoList';

export default function HomeScreen() {
  const { isLoading, error, ...view } = useVideoList();
  if (isLoading) return <Loader />;
  if (error) return <Notice text={error} />;
  return <VideoList {...view} />;
}
