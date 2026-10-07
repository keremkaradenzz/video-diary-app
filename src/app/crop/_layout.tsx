import { Stack } from 'expo-router';

import { theme } from '@/themes/theme';
import { useResetCropOnExit } from '@/hooks/use-reset-crop-on-exit';

// Every step draws its own header (StepBar), so the native one stays hidden.
export default function CropLayout() {
  useResetCropOnExit();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.surface } }} />
  );
}
