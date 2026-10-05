import { SelectVideo } from '@/features/crop/components/SelectVideo';
import { useSelectVideo } from '@/features/crop/hooks/useSelectVideo';

export default function SelectVideoScreen() {
  return <SelectVideo {...useSelectVideo()} />;
}
