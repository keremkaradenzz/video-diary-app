import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import type { MetadataErrors } from '@/features/videos/schema';

import { styles } from './metadataForm.styles';

type Props = {
  name: string;
  description: string;
  errors: MetadataErrors;
  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
};

export function MetadataForm(p: Props) {
  const { t } = useTranslation();
  return (
    <View className={styles.container}>
      <View className={styles.field}>
        <TextInput
          value={p.name}
          onChangeText={p.onChangeName}
          placeholder={t('form.name')}
          maxLength={80}
          className={styles.input}
        />
        {p.errors.name && <Text className={styles.error}>{t(p.errors.name)}</Text>}
      </View>
      <View className={styles.field}>
        <TextInput
          value={p.description}
          onChangeText={p.onChangeDescription}
          placeholder={t('form.description')}
          multiline
          textAlignVertical="top"
          className={styles.textarea}
        />
        {p.errors.description && <Text className={styles.error}>{t(p.errors.description)}</Text>}
      </View>
      {p.error && <Text className={styles.error}>{p.error}</Text>}
      <Button label={p.submitLabel} onPress={p.onSubmit} loading={p.loading} />
    </View>
  );
}
