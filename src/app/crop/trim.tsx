import { TrimStep } from '@/features/crop/components/TrimStep';
import { useTrimStep } from '@/features/crop/hooks/useTrimStep';

export default function TrimStepScreen() {
  const { ready, ...view } = useTrimStep();
  if (!ready) return null;
  return <TrimStep {...view} />;
}
