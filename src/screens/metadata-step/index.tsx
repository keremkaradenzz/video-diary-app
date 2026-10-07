import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ClipThumbnail } from '@/components/clip-thumbnail';
import { MetadataForm } from '@/components/metadata-form';
import { StepBar } from '@/components/step-bar';

import { useMetadataStep } from './hooks/use-metadata-step';

/** Last crop step: previews the selected clip and collects name and description. */
export function MetadataStep() {
  const { t } = useTranslation();
  const { ready, form, thumbnail, duration, isLoading, error, onBack } = useMetadataStep();
  if (!ready) return null;
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

const styles = {
  heading: 'flex-row items-center gap-3.5',
  title: 'flex-1 text-3xl font-extrabold text-slate-900',
};
