import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { MetadataForm } from '@/features/videos/components/MetadataForm';
import type { MetadataFormFields } from '@/features/videos/data/types';

import { styles } from './editVideo.styles';

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
