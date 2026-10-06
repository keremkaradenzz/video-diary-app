import { Loader } from '@/shared/ui/loader';
import { Notice } from '@/shared/ui/notice';
import { VideoList, useVideoList } from '@/features/videos';

export default function HomeScreen() {
  const { isLoading, error, ...view } = useVideoList();
  if (isLoading) return <Loader />;
  if (error) return <Notice text={error} />;
  return <VideoList {...view} />;
}
