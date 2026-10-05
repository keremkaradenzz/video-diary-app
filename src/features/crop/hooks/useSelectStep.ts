import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCropStore } from '@/features/crop/store';
import { CLIP_SECONDS } from '@/features/crop/constants';

export function useSelectStep() {
  const { t } = useTranslation();
  const setSource = useCropStore((s) => s.setSource);
  const [error, setError] = useState<string | null>(null);

  const onPick = async () => {
    setError(null);
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'] });
    if (res.canceled) return;
    const { uri, duration } = res.assets[0];
    const seconds = (duration ?? 0) / 1000; // picker reports milliseconds
    if (seconds < CLIP_SECONDS) {
      setError(t('crop.tooShort', { seconds: CLIP_SECONDS }));
      return;
    }
    setSource(uri, seconds);
    router.push('/crop/trim');
  };

  return { onPick, error };
}
