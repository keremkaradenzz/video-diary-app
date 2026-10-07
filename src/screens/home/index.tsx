import { Loader } from '@/components/loader';
import { Notice } from '@/components/notice';

import { VideoList } from './components/video-list';
import { useVideoList } from './hooks/use-video-list';

export function Home() {
  const { isLoading, error, ...view } = useVideoList();
  if (isLoading) return <Loader />;
  if (error) return <Notice text={error} />;
  return <VideoList {...view} />;
}
