import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ label, onPress, loading, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className="items-center rounded-lg bg-blue-600 px-6 py-3 active:opacity-80 disabled:opacity-50">
      {loading ? <ActivityIndicator color="white" /> : <Text className="font-semibold text-white">{label}</Text>}
    </Pressable>
  );
}
