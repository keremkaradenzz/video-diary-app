import { Stack } from 'expo-router';

import { useResetCropOnExit } from '@/features/crop/hooks/useResetCropOnExit';

// Every step draws its own header (StepBar), so the native one stays hidden.
export default function CropLayout() {
  useResetCropOnExit();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FAFC' } }} />;
}
