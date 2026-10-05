import { Loader, Notice } from '@/components/ui/Feedback';
import { MetadataForm } from '@/features/videos/components/MetadataForm';
import { useEditVideo } from '@/features/videos/hooks/useEditVideo';
import { useRouteVideo } from '@/features/videos/hooks/useRouteVideo';
import type { Video } from '@/features/videos/schema';

export default function EditVideoScreen() {
  const { video, isLoading } = useRouteVideo();
  if (isLoading) return <Loader />;
  if (!video) return <Notice text="Video not found." />;
  return <EditVideoContainer video={video} />;
}

// Separate container so the form state initialises from a loaded video.
function EditVideoContainer({ video }: { video: Video }) {
  const { form, isLoading, error } = useEditVideo(video);
  return <MetadataForm {...form} submitLabel="Save" loading={isLoading} error={error} />;
}
