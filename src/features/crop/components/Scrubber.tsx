import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

type Props = {
  duration: number;
  start: number;
  clipLength: number;
  onChange: (start: number) => void;
};

/** Picks the start of a fixed-length window inside the video. */
export function Scrubber({ duration, start, clipLength, onChange }: Props) {
  const { t } = useTranslation();
  const max = Math.max(duration - clipLength, 0);
  return (
    <View className="gap-2 px-4">
      <Slider minimumValue={0} maximumValue={max} step={0.1} value={start} onValueChange={onChange} />
      <Text className="text-center text-base">
        {t('crop.range', {
          start: start.toFixed(1),
          end: (start + clipLength).toFixed(1),
          total: duration.toFixed(1),
        })}
      </Text>
    </View>
  );
}
