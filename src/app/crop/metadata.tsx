import { router } from 'expo-router';

import { MetadataForm } from '@/components/MetadataForm';
import { useCropStore } from '@/features/crop/store';
import { useTrimVideo } from '@/features/crop/useTrimVideo';
import { useSaveVideo } from '@/features/videos/queries';

export default function MetadataStep() {
  const { sourceUri, startSec, reset } = useCropStore();
  const trim = useTrimVideo();
  const save = useSaveVideo();

  if (!sourceUri) {
    router.replace('/crop');
    return null;
  }

  const error = trim.error?.message ?? save.error?.message ?? null;

  return (
    <MetadataForm
      submitLabel="Crop & save"
      loading={trim.isPending || save.isPending}
      error={error}
      onSubmit={async (m) => {
        try {
          const { uri } = await trim.mutateAsync({ uri: sourceUri, start: startSec });
          await save.mutateAsync({ ...m, uri, startSec });
          reset();
          router.dismissAll();
        } catch {
          // surfaced through mutation error state
        }
      }}
    />
  );
}
