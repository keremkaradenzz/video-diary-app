import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { theme } from '@/core/theme';
import { Button } from '@/shared/ui/Button';

import { styles } from './Scrubber.styles';

type Props = {
  duration: number;
  start: number;
  clipLength: number;
  /** Fires continuously while the slider is dragged. */
  onChange: (start: number) => void;
  /** Fires once with the final value (slider released, or a nudge button). */
  onCommit: (start: number) => void;
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

/** Picks the start of a fixed-length window inside the video; the end follows automatically. */
export function Scrubber({ duration, start, clipLength, onChange, onCommit }: Props) {
  const { t } = useTranslation();
  const max = Math.max(duration - clipLength, 0);
  const nudge = (d: number) => onCommit(Math.min(Math.max(start + d, 0), max));
  return (
    <View className={styles.container}>
      <View className={styles.times}>
        <View>
          <Text className={styles.timeLabel}>{t('crop.start')}</Text>
          <Text className={styles.timeValue}>{fmt(start)}</Text>
        </View>
        <View>
          <Text className={`${styles.timeLabel} text-right`}>{t('crop.end')}</Text>
          <Text className={styles.timeValue}>{fmt(start + clipLength)}</Text>
        </View>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={max}
        step={0.1}
        value={start}
        onValueChange={onChange}
        onSlidingComplete={onCommit}
        minimumTrackTintColor={theme.colors.brand}
        thumbTintColor={theme.colors.brand}
        accessibilityLabel={t('crop.start')}
      />
      <View className={styles.nudges}>
        <View className={styles.nudge}>
          <Button variant="secondary" label={t('crop.minus')} onPress={() => nudge(-1)} />
        </View>
        <View className={styles.nudge}>
          <Button variant="secondary" label={t('crop.plus')} onPress={() => nudge(1)} />
        </View>
      </View>
      <Text className={styles.hint}>{t('crop.trimHint', { seconds: clipLength })}</Text>
    </View>
  );
}
