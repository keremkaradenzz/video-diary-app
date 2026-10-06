import { Loader } from '@/shared/ui/Loader';
import { Notice } from '@/shared/ui/Notice';
import { VideoList, useVideoList } from '@/features/videos';

export default function HomeScreen() {
  const { isLoading, error, ...view } = useVideoList();
  if (isLoading) return <Loader />;
  if (error) return <Notice text={error} />;
  return <VideoList {...view} />;
}
