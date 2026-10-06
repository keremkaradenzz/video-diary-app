import { MetadataStep } from '@/features/crop/components/MetadataStep';
import { useMetadataStep } from '@/features/crop/hooks/useMetadataStep';

export default function MetadataStepScreen() {
  const { ready, ...view } = useMetadataStep();
  if (!ready) return null;
  return <MetadataStep {...view} />;
}
