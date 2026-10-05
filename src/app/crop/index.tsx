import { SelectVideo } from '@/features/crop/components/SelectVideo';
import { useSelectStep } from '@/features/crop/hooks/useSelectStep';

export default function SelectVideoScreen() {
  return <SelectVideo {...useSelectStep()} />;
}
