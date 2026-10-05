import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';

type Props = { onPick: () => void; error: string | null };

export function SelectVideo({ onPick, error }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Button label="Choose a video" onPress={onPick} />
      {error && <Text className="text-red-600">{error}</Text>}
    </View>
  );
}
