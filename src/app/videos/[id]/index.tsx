import { useTranslation } from 'react-i18next';

import { Loader } from '@/shared/ui/Loader';
import { Notice } from '@/shared/ui/Notice';
import { VideoDetails, useRouteVideo, useVideoDetails } from '@/features/videos';

export default function VideoDetailsScreen() {
  const { t } = useTranslation();
  const { video, isLoading } = useRouteVideo();
  const details = useVideoDetails(video);
  if (isLoading) return <Loader />;
  if (!video) return <Notice text={t('common.notFound')} />;
  return <VideoDetails video={video} {...details} />;
}
