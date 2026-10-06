import '@/core/i18n';
import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { t } = useTranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#F8FAFC' },
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: t('home.title'),
            headerLargeTitle: true,
            headerShown: false,
          }}
        />
        <Stack.Screen name="videos/[id]" options={{ title: t('details.title'), headerShown: false }} />
        <Stack.Screen name="videos/[id]/edit" options={{ title: t('edit.title'), headerShown: false }} />
        <Stack.Screen name="crop" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
