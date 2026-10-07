import { ActivityIndicator, Pressable, Text } from 'react-native';

import { theme } from '@/core/theme';

import { styles } from './button.styles';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

const labelStyles = {
  primary: styles.labelPrimary,
  secondary: styles.labelSecondary,
  danger: styles.labelDanger,
};

export function Button({ label, onPress, loading, disabled, variant = 'primary' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`${styles.container} ${styles[variant]}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : theme.colors.brand} />
      ) : (
        <Text className={`${styles.label} ${labelStyles[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
