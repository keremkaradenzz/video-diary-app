import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { CLIP_SECONDS } from '@/constants/config';
import { useMetadataForm } from '@/hooks/use-metadata-form';
import { useRequireSource } from '@/hooks/use-require-source';
import { useSaveVideo } from '@/hooks/use-save-video';
import { useCropStore } from '@/hooks/use-crop-store';
import { deleteFile, deleteIfCached } from '@/utils/files';
import { clipThumbKey, primeThumbnail } from '@/utils/thumbnails';

import { useClipThumbnail } from './use-clip-thumbnail';
import { isTrimUnavailable, useTrimVideo } from './use-trim-video';

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
      // Before saving: the save refreshes the list, which would otherwise decode the new clip for this frame.
      if (thumbnail.data) await primeThumbnail(clipThumbKey(uri), thumbnail.data);
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
