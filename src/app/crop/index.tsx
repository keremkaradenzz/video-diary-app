import { SelectStep } from '@/features/crop/components/SelectStep';
import { useSelectStep } from '@/features/crop/hooks/useSelectStep';

export default function SelectStepScreen() {
  return <SelectStep {...useSelectStep()} />;
}
