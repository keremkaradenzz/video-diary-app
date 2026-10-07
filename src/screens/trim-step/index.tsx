import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { StepBar } from '@/components/step-bar';
import { VideoPlayer } from '@/components/video-player';

import { Scrubber } from './components/scrubber';
import { useTrimStep } from './hooks/use-trim-step';

/** Crop step 2: choose the 5 second window with the scrubber. */
export function TrimStep() {
  const { t } = useTranslation();
  const {
    ready,
    player,
    frames,
    duration,
    startSec,
    clipLength,
    onChangeStart,
    onCommitStart,
    onNext,
    onBack,
  } = useTrimStep();
  if (!ready) return null;
  return (
    <Screen className={styles.container}>
      <StepBar step={2} onBack={onBack} />
      <Text className={styles.title}>{t('crop.trimHeading', { seconds: clipLength })}</Text>
      <View className={styles.player}>
        <VideoPlayer player={player} height={210} />
        <View className={styles.badge} pointerEvents="none">
          <Text className={styles.badgeText}>{t('crop.previewLabel', { seconds: clipLength })}</Text>
        </View>
      </View>
      <Scrubber
        frames={frames}
        duration={duration}
        start={startSec}
        clipLength={clipLength}
        onChange={onChangeStart}
        onCommit={onCommitStart}
      />
      <View className={styles.spacer} />
      <Button label={t('crop.next')} onPress={onNext} />
    </Screen>
  );
}

const styles = {
  container: 'gap-4 px-4 pb-3',
  title: 'text-3xl font-extrabold text-slate-900',
  player: 'overflow-hidden rounded-2xl',
  badge: 'absolute left-3 top-3 z-10 rounded-lg bg-slate-900/80 px-2 py-1',
  badgeText: 'text-xs font-semibold text-white',
  spacer: 'flex-1',
};
