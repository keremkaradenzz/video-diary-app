import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { CLIP_SECONDS } from '@/constants';
import { isTrimUnavailable, useClipThumbnail, useTrimVideo } from '@/features/crop/queries';
import { useCropStore } from '@/features/crop/store';
import { useMetadataForm } from '@/features/videos/hooks/useMetadataForm';
import { useSaveVideo } from '@/features/videos/queries';

import { useRequireSource } from './useRequireSource';

/** Final step: validate metadata, trim the clip, save it, close the modal. */
export function useMetadataStep() {
  const { t } = useTranslation();
  const sourceUri = useRequireSource();
  const startSec = useCropStore((s) => s.startSec);
  const trim = useTrimVideo();
  const thumbnail = useClipThumbnail(sourceUri, startSec);
  const save = useSaveVideo();

  const form = useMetadataForm(undefined, async (m) => {
    if (!sourceUri) return;
    try {
      const { uri } = await trim.mutateAsync({ uri: sourceUri, start: startSec });
      await save.mutateAsync({ ...m, uri, startSec });
      router.dismissAll();
    } catch {
      // surfaced through the mutations' error state
    }
  });

  return {
    ready: !!sourceUri,
    onBack: () => router.back(),
    form,
    thumbnail: thumbnail.data ?? undefined,
    duration: `0:${String(CLIP_SECONDS).padStart(2, '0')}`,
    isLoading: trim.isPending || save.isPending,
    error: isTrimUnavailable(trim.error)
      ? t('crop.trimUnavailable')
      : (trim.error?.message ?? save.error?.message ?? null),
  };
}
