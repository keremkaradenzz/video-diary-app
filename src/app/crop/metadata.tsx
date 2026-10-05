import { useMetadataStep } from '@/features/crop/hooks/useMetadataStep';
import { MetadataForm } from '@/features/videos/components/MetadataForm';

export default function MetadataScreen() {
  const { ready, form, isLoading, error } = useMetadataStep();
  if (!ready) return null;
  return <MetadataForm {...form} submitLabel="Crop & save" loading={isLoading} error={error} />;
}
