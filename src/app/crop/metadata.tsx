import { MetadataStep, useMetadataStep } from '@/features/crop';

export default function MetadataStepScreen() {
  const { ready, ...view } = useMetadataStep();
  if (!ready) return null;
  return <MetadataStep {...view} />;
}
