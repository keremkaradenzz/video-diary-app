import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { CLIP_SECONDS } from '@/core/config';
import { isTrimUnavailable, useClipThumbnail, useTrimVideo } from '@/features/crop/api/queries';
import { useCropStore } from '@/features/crop/model/store';
import { useMetadataForm, useSaveVideo } from '@/features/videos';

import { deleteFile, deleteIfCached } from '@/shared/utils/files';

import { useRequireSource } from './use-require-source';

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
      try {
        await save.mutateAsync({ ...m, uri, startSec });
      } catch (error) {
        deleteFile(uri); // no row points at the trimmed clip, so do not leave it behind
        throw error;
      }
      deleteIfCached(sourceUri); // the picker's cache copy is no longer needed
      router.dismissTo('/');
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
