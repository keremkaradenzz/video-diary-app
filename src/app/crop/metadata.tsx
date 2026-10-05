import { useTranslation } from 'react-i18next';

import { useMetadataStep } from '@/features/crop/hooks/useMetadataStep';
import { MetadataForm } from '@/features/videos/components/MetadataForm';

export default function MetadataScreen() {
  const { t } = useTranslation();
  const { ready, form, isLoading, error, onBack, thumbnail, duration } = useMetadataStep();
  if (!ready) return null;
  return <MetadataForm {...form} step={3} onBack={onBack} heading={t('crop.metadataHeading')} thumbnail={thumbnail} duration={duration} submitLabel={t('crop.cropAndSave')} loading={isLoading} error={error} />;
}
