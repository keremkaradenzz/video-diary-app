import { Stack } from 'expo-router';

import { theme } from '@/core/theme';
import { useResetCropOnExit } from '@/features/crop';

// Every step draws its own header (StepBar), so the native one stays hidden.
export default function CropLayout() {
  useResetCropOnExit();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.surface } }} />
  );
}
