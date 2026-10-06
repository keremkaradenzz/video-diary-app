import { SelectStep, useSelectStep } from '@/features/crop';

export default function SelectStepScreen() {
  return <SelectStep {...useSelectStep()} />;
}
