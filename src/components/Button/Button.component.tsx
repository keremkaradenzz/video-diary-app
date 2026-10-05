import { ActivityIndicator, Pressable, Text } from 'react-native';

import { styles } from './button.styles';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ label, onPress, loading, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} className={styles.container}>
      {loading ? <ActivityIndicator color="white" /> : <Text className={styles.label}>{label}</Text>}
    </Pressable>
  );
}
