import { Loader, Notice } from '@/components/ui/Feedback';
import { VideoDetails } from '@/features/videos/components/VideoDetails';
import { useRouteVideo } from '@/features/videos/hooks/useRouteVideo';
import { useVideoDetails } from '@/features/videos/hooks/useVideoDetails';

export default function VideoDetailsScreen() {
  const { video, isLoading } = useRouteVideo();
  const details = useVideoDetails(video);
  if (isLoading) return <Loader />;
  if (!video) return <Notice text="Video not found." />;
  return <VideoDetails video={video} {...details} />;
}
