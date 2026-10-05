import { useTranslation } from 'react-i18next';

import { Loader } from '@/components/Loader';
import { Notice } from '@/components/Notice';
import { MetadataForm } from '@/features/videos/components/MetadataForm';
import { useEditVideo } from '@/features/videos/hooks/useEditVideo';
import { useRouteVideo } from '@/features/videos/hooks/useRouteVideo';
import type { Video } from '@/features/videos/types';

export default function EditVideoScreen() {
  const { t } = useTranslation();
  const { video, isLoading } = useRouteVideo();
  if (isLoading) return <Loader />;
  if (!video) return <Notice text={t('common.notFound')} />;
  return <EditVideoContainer video={video} />;
}

// Separate container so the form state initialises from a loaded video.
function EditVideoContainer({ video }: { video: Video }) {
  const { t } = useTranslation();
  const { form, isLoading, error, onBack } = useEditVideo(video);
  return <MetadataForm {...form} onBack={onBack} heading={t('edit.heading')} submitLabel={t('edit.save')} loading={isLoading} error={error} />;
}
