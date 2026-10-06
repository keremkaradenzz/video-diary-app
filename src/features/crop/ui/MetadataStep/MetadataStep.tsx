import type { VideoThumbnail } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ClipThumbnail } from '@/shared/media/ui/ClipThumbnail';
import { StepBar } from '@/shared/ui/StepBar';
import { MetadataForm, type MetadataFormFields } from '@/features/videos';

import { styles } from './MetadataStep.styles';

type Props = {
  form: MetadataFormFields;
  thumbnail?: VideoThumbnail;
  duration: string;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
};

/** Last crop step: previews the selected clip and collects name and description. */
export function MetadataStep({ form, thumbnail, duration, isLoading, error, onBack }: Props) {
  const { t } = useTranslation();
  return (
    <MetadataForm
      {...form}
      submitLabel={t('crop.cropAndSave')}
      loading={isLoading}
      error={error}
      header={
        <>
          <StepBar step={3} onBack={onBack} />
          <View className={styles.heading}>
            <ClipThumbnail thumbnail={thumbnail} duration={duration} />
            <Text className={styles.title}>{t('crop.metadataHeading')}</Text>
          </View>
        </>
      }
    />
  );
}
