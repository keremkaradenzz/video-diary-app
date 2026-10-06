import { useEffect } from 'react';

import { useCropStore } from '@/features/crop/model/store';

/** Clears the crop flow state once the crop modal is dismissed. */
export function useResetCropOnExit() {
  const reset = useCropStore((s) => s.reset);
  useEffect(() => reset, [reset]);
}
