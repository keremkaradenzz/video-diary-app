import { Stack } from 'expo-router';

export default function CropLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '1. Select video' }} />
      <Stack.Screen name="trim" options={{ title: '2. Crop' }} />
      <Stack.Screen name="metadata" options={{ title: '3. Details' }} />
    </Stack>
  );
}
