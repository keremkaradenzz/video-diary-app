import { Stack } from 'expo-router';

import { useResetCropOnExit } from '@/features/crop/hooks/useResetCropOnExit';

export default function CropLayout() {
  useResetCropOnExit();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '1. Select video' }} />
      <Stack.Screen name="trim" options={{ title: '2. Crop' }} />
      <Stack.Screen name="metadata" options={{ title: '3. Details' }} />
    </Stack>
  );
}
