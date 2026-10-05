import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';

import { CLIP_SECONDS } from '@/features/videos/schema';

type Props = {
  duration: number;
  start: number;
  onChange: (start: number) => void;
};

const fmt = (s: number) => `${s.toFixed(1)}s`;

/** Picks the start of a fixed CLIP_SECONDS window inside the video. */
export function Scrubber({ duration, start, onChange }: Props) {
  const max = Math.max(duration - CLIP_SECONDS, 0);
  return (
    <View className="gap-2 px-4">
      <Slider minimumValue={0} maximumValue={max} step={0.1} value={start} onValueChange={onChange} />
      <Text className="text-center text-base">
        {fmt(start)} – {fmt(start + CLIP_SECONDS)} of {fmt(duration)}
      </Text>
    </View>
  );
}
