import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './stepBar.styles';

type Props = {
  step: number;
  total?: number;
  onBack: () => void;
  /** First step closes the whole flow instead of going back. */
  closes?: boolean;
};

/** Screen header for the crop flow: back/close button, "Step n / total" and a progress bar. */
export function StepBar({ step, total = 3, onBack, closes }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View className={styles.container} style={{ paddingTop: insets.top }}>
      <View className={styles.row}>
        <Pressable
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t(closes ? 'common.close' : 'common.back')}
          className={styles.back}
        >
          <Text className={styles.icon}>{closes ? '✕' : '‹'}</Text>
        </Pressable>
        <Text className={styles.label}>{t('crop.step', { step, total })}</Text>
      </View>
      <View className={styles.bars}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} className={i < step ? styles.on : styles.off} />
        ))}
      </View>
    </View>
  );
}
