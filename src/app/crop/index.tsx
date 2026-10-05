import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useCropStore } from '@/features/crop/store';
import { CLIP_SECONDS } from '@/features/videos/schema';

export default function SelectVideo() {
  const setSource = useCropStore((s) => s.setSource);
  const [error, setError] = useState<string | null>(null);

  const pick = async () => {
    setError(null);
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'] });
    if (res.canceled) return;
    const { uri, duration } = res.assets[0];
    const seconds = (duration ?? 0) / 1000; // picker reports milliseconds
    if (seconds < CLIP_SECONDS) {
      setError(`Video must be at least ${CLIP_SECONDS} seconds long.`);
      return;
    }
    setSource(uri, seconds);
    router.push('/crop/trim');
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Pressable onPress={pick} className="rounded-lg bg-blue-600 px-6 py-3 active:opacity-80">
        <Text className="font-semibold text-white">Choose a video</Text>
      </Pressable>
      {error && <Text className="text-red-600">{error}</Text>}
    </View>
  );
}
