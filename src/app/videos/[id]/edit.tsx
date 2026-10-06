import { useTranslation } from 'react-i18next';

import { Loader } from '@/shared/components/Loader';
import { Notice } from '@/shared/components/Notice';
import { EditVideo } from '@/features/videos/components/EditVideo';
import { useEditVideo } from '@/features/videos/hooks/useEditVideo';
import { useRouteVideo } from '@/features/videos/hooks/useRouteVideo';
import type { Video } from '@/features/videos/data/types';

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
