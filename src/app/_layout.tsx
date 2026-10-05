import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Video Diary' }} />
        <Stack.Screen name="video/[id]" options={{ title: 'Details' }} />
        <Stack.Screen name="edit/[id]" options={{ title: 'Edit', presentation: 'modal' }} />
        <Stack.Screen name="crop" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
