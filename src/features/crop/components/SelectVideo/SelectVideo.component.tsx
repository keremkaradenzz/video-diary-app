import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';

import { styles } from './selectVideo.styles';

type Props = { onPick: () => void; error: string | null };

export function SelectVideo({ onPick, error }: Props) {
  const { t } = useTranslation();
  return (
    <View className={styles.container}>
      <Button label={t('crop.choose')} onPress={onPick} />
      {error && <Text className={styles.error}>{error}</Text>}
    </View>
  );
}
