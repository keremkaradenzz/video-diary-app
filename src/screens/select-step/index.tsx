import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { StepBar } from '@/components/step-bar';

import { useSelectStep } from './hooks/use-select-step';

/** Crop step 1: pick a video from the library. */
export function SelectStep() {
  const { t } = useTranslation();
  const { onPick, onClose, error, minSeconds } = useSelectStep();
  return (
    <Screen className={styles.container}>
      <StepBar step={1} onBack={onClose} closes />
      <Text className={styles.title}>{t('crop.selectHeading')}</Text>
      <Text className={styles.hint}>{t('crop.selectHint')}</Text>
      <View className={styles.drop}>
        <Text className={styles.dropTitle}>{t('crop.noVideo')}</Text>
        <Text className={styles.dropHint}>{t('crop.tooShort', { seconds: minSeconds })}</Text>
        {error && (
          <Animated.View entering={FadeInDown}>
            <Text className={styles.error}>{error}</Text>
          </Animated.View>
        )}
      </View>
      <View className={styles.spacer} />
      <Button label={t('crop.choose')} onPress={onPick} />
    </Screen>
  );
}

const styles = {
  container: 'gap-4 px-4 pb-3',
  title: 'text-3xl font-extrabold text-slate-900',
  hint: 'text-base text-slate-600',
  drop: 'max-h-96 flex-1 items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-400 bg-white p-6',
  dropTitle: 'text-lg font-bold text-slate-900',
  dropHint: 'text-center text-sm text-slate-600',
  spacer: 'flex-1',
  error: 'text-center text-sm font-medium text-red-700',
};
