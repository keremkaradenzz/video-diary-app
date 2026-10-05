import { router } from 'expo-router';
import { useEffect } from 'react';

import { useCropStore } from '@/features/crop/store';

/** Returns the picked video uri; sends the user back to step 1 if there is none. */
export function useRequireSource() {
  const sourceUri = useCropStore((s) => s.sourceUri);
  useEffect(() => {
    if (!sourceUri) router.replace('/crop');
  }, [sourceUri]);
  return sourceUri;
}
