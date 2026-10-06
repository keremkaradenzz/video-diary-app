import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text, View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';
import { StepBar } from '@/shared/ui/step-bar';

import { styles } from './select-step.styles';

type Props = { onPick: () => void; onClose: () => void; error: string | null; minSeconds: number };

export function SelectStep({ onPick, onClose, error, minSeconds }: Props) {
  const { t } = useTranslation();
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
