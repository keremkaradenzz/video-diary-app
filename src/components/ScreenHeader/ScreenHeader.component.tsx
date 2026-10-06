import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { styles } from './screenHeader.styles';

/** Minimal header: just a back button, below the status bar. */
export function ScreenHeader({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  return (
    <View className={styles.container}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        className={styles.back}
      >
        <Text className={styles.icon}>‹</Text>
      </Pressable>
    </View>
  );
}
