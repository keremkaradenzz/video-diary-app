import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';

type Props = { onPick: () => void; error: string | null };

export function SelectVideo({ onPick, error }: Props) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Button label={t('crop.choose')} onPress={onPick} />
      {error && <Text className="text-red-600">{error}</Text>}
    </View>
  );
}
