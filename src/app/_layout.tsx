import '@/i18n';
import '../themes/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getDb } from '@/db';
import { queryClient } from '@/query/client';
import { theme } from '@/themes/theme';
import { ErrorFallback } from '@/components/error-fallback';

// A render error in any route shows this instead of a white screen; `retry` re-renders the route.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErrorFallback detail={__DEV__ ? error.message : undefined} onRetry={() => void retry()} />;
}

// Keep the splash screen up until SQLite is open, so the list never starts with a spinner.
void SplashScreen.preventAutoHideAsync();
getDb()
  .catch(() => undefined) // the first query reports the real error
  .finally(() => void SplashScreen.hideAsync());

// Every screen draws its own header, so the native one stays hidden.
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.surface } }}
        >
          <Stack.Screen name="crop" options={{ presentation: 'fullScreenModal' }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
