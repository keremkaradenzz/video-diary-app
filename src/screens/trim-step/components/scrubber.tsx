import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type AccessibilityActionEvent, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Button } from '@/components/button';

import { Filmstrip } from './filmstrip';

import type { VideoThumbnail } from 'expo-video';

type Props = {
  frames: VideoThumbnail[];
  duration: number;
  start: number;
  clipLength: number;
  /** Fires continuously while the window is dragged. */
  onChange: (start: number) => void;
  /** Fires once with the final value (finger lifted, or a nudge button). */
  onCommit: (start: number) => void;
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const snap = (s: number) => Math.round(s * 10) / 10;

/**
 * Drag the fixed-length window along the filmstrip (or tap to jump it there); the end follows
 * automatically. The ±1 s buttons and the accessibility actions do the same without a gesture.
 */
export function Scrubber({ frames, duration, start, clipLength, onChange, onCommit }: Props) {
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);
  const max = Math.max(duration - clipLength, 0);
  const clamp = (s: number) => snap(Math.min(Math.max(s, 0), max));
  const nudge = (d: number) => {
    void Haptics.selectionAsync();
    onCommit(clamp(start + d));
  };

  const origin = useSharedValue(0);
  const last = useSharedValue(0);

  const gesture = useMemo(() => {
    const at = (s: number) => {
      'worklet';
      return Math.round(Math.min(Math.max(s, 0), max) * 10) / 10;
    };
    const tick = (heavy: boolean) => {
      void (heavy ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Haptics.selectionAsync());
    };
    return Gesture.Pan()
      .minDistance(0)
      .onBegin((e) => {
        const touched = (e.x / width) * duration;
        // Touching outside the window moves it there, centred under the finger.
        const from = touched >= start && touched <= start + clipLength ? start : at(touched - clipLength / 2);
        origin.set(from);
        last.set(from);
        if (from !== start) scheduleOnRN(onChange, from);
        scheduleOnRN(tick, false);
      })
      .onUpdate((e) => {
        const next = at(origin.get() + (e.translationX / width) * duration);
        const prev = last.get();
        if (next === prev) return;
        // A tick when the window reaches either end of the video.
        if ((next === 0 || next === max) && prev !== 0 && prev !== max) scheduleOnRN(tick, true);
        last.set(next);
        scheduleOnRN(onChange, next);
      })
      .onFinalize(() => {
        scheduleOnRN(onCommit, last.get());
      });
  }, [width, duration, clipLength, max, start, onChange, onCommit, origin, last]);

  const onAction = (e: AccessibilityActionEvent) => {
    if (e.nativeEvent.actionName === 'increment') nudge(1);
    if (e.nativeEvent.actionName === 'decrement') nudge(-1);
  };

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
      <GestureDetector gesture={gesture}>
        <View
          onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={t('crop.start')}
          accessibilityValue={{ text: fmt(start) }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={onAction}
        >
          <Filmstrip frames={frames} duration={duration} start={start} clipLength={clipLength} />
        </View>
      </GestureDetector>
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

const styles = {
  container: 'gap-3',
  times: 'flex-row justify-between',
  timeLabel: 'text-sm text-slate-600',
  timeValue: 'text-2xl font-extrabold text-slate-900',
  nudges: 'flex-row gap-3',
  nudge: 'flex-1',
  hint: 'text-sm text-slate-600',
};
