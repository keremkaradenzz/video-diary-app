import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import type { MetadataErrors } from '@/features/videos/schema';

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
    <View className="gap-4 p-4">
      <View className="gap-1">
        <TextInput
          value={p.name}
          onChangeText={p.onChangeName}
          placeholder={t('form.name')}
          maxLength={80}
          className="rounded-lg border border-gray-300 px-3 py-3 text-base"
        />
        {p.errors.name && <Text className="text-sm text-red-600">{t(p.errors.name)}</Text>}
      </View>
      <View className="gap-1">
        <TextInput
          value={p.description}
          onChangeText={p.onChangeDescription}
          placeholder={t('form.description')}
          multiline
          textAlignVertical="top"
          className="h-32 rounded-lg border border-gray-300 px-3 py-3 text-base"
        />
        {p.errors.description && <Text className="text-sm text-red-600">{t(p.errors.description)}</Text>}
      </View>
      {p.error && <Text className="text-sm text-red-600">{p.error}</Text>}
      <Button label={p.submitLabel} onPress={p.onSubmit} loading={p.loading} />
    </View>
  );
}
