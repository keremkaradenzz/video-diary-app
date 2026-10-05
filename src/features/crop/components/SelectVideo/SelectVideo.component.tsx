import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { StepBar } from '@/components/StepBar';

import { styles } from './selectVideo.styles';

type Props = { onPick: () => void; onClose: () => void; error: string | null; minSeconds: number };

export function SelectVideo({ onPick, onClose, error, minSeconds }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View className={styles.container} style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
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
    </View>
  );
}
