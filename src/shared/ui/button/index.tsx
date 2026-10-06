import { ActivityIndicator, Pressable, Text } from 'react-native';

import { theme } from '@/core/theme';

import { styles } from './button.styles';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function Button({ label, onPress, loading, disabled, variant = 'primary' }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`${styles.container} ${primary ? styles.primary : styles.secondary}`}
    >
      {loading ? (
        <ActivityIndicator color={primary ? 'white' : theme.colors.brand} />
      ) : (
        <Text className={`${styles.label} ${primary ? styles.labelPrimary : styles.labelSecondary}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
