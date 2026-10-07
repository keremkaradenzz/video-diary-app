import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Loader } from '@/components/loader';
import { MetadataForm } from '@/components/metadata-form';
import { Notice } from '@/components/notice';
import { ScreenHeader } from '@/components/screen-header';
import { useVideo } from '@/hooks/use-video';
import type { Video } from '@/types/video';

import { useEditVideo } from './hooks/use-edit-video';

export function EditVideo({ id }: { id: number }) {
  const { t } = useTranslation();
  const { data: video, isPending } = useVideo(id);
  if (isPending) return <Loader />;
  if (!video) return <Notice text={t('common.notFound')} />;
  return <EditVideoForm video={video} />;
}

// Separate component so the form state initialises from a loaded video.
function EditVideoForm({ video }: { video: Video }) {
  const { t } = useTranslation();
  const { form, onBack, isLoading, error } = useEditVideo(video);
  return (
    <MetadataForm
      {...form}
      submitLabel={t('edit.save')}
      loading={isLoading}
      error={error}
      header={
        <>
          <ScreenHeader onBack={onBack} />
          <Text className={styles.title}>{t('edit.heading')}</Text>
        </>
      }
    />
  );
}

const styles = {
  title: 'text-3xl font-extrabold text-slate-900',
};
