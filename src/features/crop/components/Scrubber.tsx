import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';

type Props = {
  duration: number;
  start: number;
  clipLength: number;
  onChange: (start: number) => void;
};

const fmt = (s: number) => `${s.toFixed(1)}s`;

/** Picks the start of a fixed-length window inside the video. */
export function Scrubber({ duration, start, clipLength, onChange }: Props) {
  const max = Math.max(duration - clipLength, 0);
  return (
    <View className="gap-2 px-4">
      <Slider minimumValue={0} maximumValue={max} step={0.1} value={start} onValueChange={onChange} />
      <Text className="text-center text-base">
        {fmt(start)} – {fmt(start + clipLength)} of {fmt(duration)}
      </Text>
    </View>
  );
}
