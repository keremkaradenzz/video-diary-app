import { useTranslation } from 'react-i18next';

import { Loader } from '@/shared/ui/loader';
import { Notice } from '@/shared/ui/notice';
import { EditVideo, useEditVideo, useRouteVideo, type Video } from '@/features/videos';

export default function EditVideoScreen() {
  const { t } = useTranslation();
  const { video, isLoading } = useRouteVideo();
  if (isLoading) return <Loader />;
  if (!video) return <Notice text={t('common.notFound')} />;
  return <EditVideoContainer video={video} />;
}

// Separate container so the form state initialises from a loaded video.
function EditVideoContainer({ video }: { video: Video }) {
  return <EditVideo {...useEditVideo(video)} />;
}
