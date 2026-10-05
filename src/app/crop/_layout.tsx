import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useResetCropOnExit } from '@/features/crop/hooks/useResetCropOnExit';

export default function CropLayout() {
  const { t } = useTranslation();
  useResetCropOnExit();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('crop.selectTitle') }} />
      <Stack.Screen name="trim" options={{ title: t('crop.trimTitle') }} />
      <Stack.Screen name="metadata" options={{ title: t('crop.metadataTitle') }} />
    </Stack>
  );
}
