import '@/core/i18n';
import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { getDb } from '@/core/db';
import { queryClient } from '@/core/query';
import { theme } from '@/core/theme';

// Route errors render expo-router's default fallback instead of a white screen.
export { ErrorBoundary } from 'expo-router';

// Keep the splash screen up until SQLite is open, so the list never starts with a spinner.
void SplashScreen.preventAutoHideAsync();
getDb()
  .catch(() => undefined) // the first query reports the real error
  .finally(() => void SplashScreen.hideAsync());

// Every screen draws its own header, so the native one stays hidden.
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.surface } }}>
        <Stack.Screen name="crop" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
