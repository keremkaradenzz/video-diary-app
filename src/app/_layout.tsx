import '@/core/i18n';
import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';

import { getDb } from '@/core/db';
import { queryClient } from '@/core/queryClient';

// Keep the splash screen up until SQLite is open, so the list never starts with a spinner.
void SplashScreen.preventAutoHideAsync();
getDb()
  .catch(() => undefined) // the first query reports the real error
  .finally(() => void SplashScreen.hideAsync());

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
