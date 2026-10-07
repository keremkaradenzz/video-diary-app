import { ActivityIndicator, Pressable, Text } from 'react-native';

import { theme } from '@/themes/theme';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
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

const styles = {
  container: 'h-14 items-center justify-center rounded-2xl active:opacity-80 disabled:opacity-50',
  primary: 'bg-brand',
  secondary: 'border border-slate-300 bg-white',
  danger: 'border border-red-200 bg-white',
  label: 'text-base font-bold',
  labelPrimary: 'text-white',
  labelSecondary: 'text-slate-900',
  labelDanger: 'text-red-600',
};

const labelStyles = {
  primary: styles.labelPrimary,
  secondary: styles.labelSecondary,
  danger: styles.labelDanger,
};
