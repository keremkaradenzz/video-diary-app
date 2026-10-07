import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';

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

const styles = {
  body: 'flex-1 items-center justify-center gap-3 px-6',
  title: 'text-xl font-semibold text-gray-900',
  hint: 'text-center text-gray-500',
  detail: 'mt-2 text-center text-xs text-gray-400',
  bar: 'px-4 pb-4',
};
