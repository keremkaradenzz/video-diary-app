import '../global.css';
import '@/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { t } = useTranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: t('home.title') }} />
        <Stack.Screen name="videos/[id]" options={{ title: t('details.title') }} />
        <Stack.Screen name="videos/[id]/edit" options={{ title: t('edit.title'), presentation: 'modal' }} />
        <Stack.Screen name="crop" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
