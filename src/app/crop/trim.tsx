import { TrimStep, useTrimStep } from '@/features/crop';

export default function TrimStepScreen() {
  const { ready, ...view } = useTrimStep();
  if (!ready) return null;
  return <TrimStep {...view} />;
}
