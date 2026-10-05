import { router } from 'expo-router';
import type { VideoPlayer as Player } from 'expo-video';
import { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Scrubber } from '@/components/Scrubber';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useCropStore } from '@/features/crop/store';
import { CLIP_SECONDS } from '@/features/videos/schema';

export default function Trim() {
  const { sourceUri, duration, startSec, setStart } = useCropStore();
  const player = useRef<Player | null>(null);
  const start = useRef(startSec);

  if (!sourceUri) {
    router.replace('/crop');
    return null;
  }

  const onReady = (p: Player) => {
    player.current = p;
    p.timeUpdateEventInterval = 0.1;
    // Loop the selected 5s window.
    p.addListener('timeUpdate', ({ currentTime }) => {
      if (currentTime >= start.current + CLIP_SECONDS || currentTime < start.current - 0.5) {
        p.currentTime = start.current;
      }
    });
  };

  const onChange = (s: number) => {
    start.current = s;
    setStart(s);
    if (player.current) player.current.currentTime = s;
  };

  return (
    <View className="flex-1 gap-4">
      <VideoPlayer uri={sourceUri} onReady={onReady} />
      <Scrubber duration={duration} start={startSec} onChange={onChange} />
      <View className="px-4">
        <Pressable
          onPress={() => router.push('/crop/metadata')}
          className="items-center rounded-lg bg-blue-600 py-3 active:opacity-80">
          <Text className="font-semibold text-white">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
