import { useLocalSearchParams } from 'expo-router';

import { useVideo } from '@/features/videos/api/queries';

/** Loads the video addressed by the `[id]` route param. */
export function useRouteVideo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending } = useVideo(Number(id));
  return { video: data ?? undefined, isLoading: isPending };
}
