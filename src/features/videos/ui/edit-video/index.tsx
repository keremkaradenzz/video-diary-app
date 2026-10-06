import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { ScreenHeader } from '@/shared/ui/screen-header';
import { MetadataForm } from '@/features/videos/ui/metadata-form';
import type { MetadataFormFields } from '@/features/videos/model/types';

import { styles } from './edit-video.styles';

type Props = {
  form: MetadataFormFields;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
};

export function EditVideo({ form, isLoading, error, onBack }: Props) {
  const { t } = useTranslation();
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
