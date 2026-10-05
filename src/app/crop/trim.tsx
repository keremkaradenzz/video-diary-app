import { TrimEditor } from '@/features/crop/components/TrimEditor';
import { useTrimStep } from '@/features/crop/hooks/useTrimStep';

export default function TrimScreen() {
  const { ready, ...view } = useTrimStep();
  if (!ready) return null;
  return <TrimEditor {...view} />;
}
