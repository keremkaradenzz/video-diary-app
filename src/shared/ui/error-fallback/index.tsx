import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/shared/ui/button';
import { Screen } from '@/shared/ui/screen';

import { styles } from './error-fallback.styles';

type Props = {
  onRetry: () => void;
  /** Technical message, for development builds only. */
  detail?: string;
};

/** Shown by a route's `ErrorBoundary` when rendering throws. */
export function ErrorFallback({ onRetry, detail }: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <View className={styles.body}>
        <Text className={styles.title}>{t('error.title')}</Text>
        <Text className={styles.hint}>{t('error.hint')}</Text>
        {!!detail && <Text className={styles.detail}>{detail}</Text>}
      </View>
      <View className={styles.bar}>
        <Button label={t('error.retry')} onPress={onRetry} />
      </View>
    </Screen>
  );
}
