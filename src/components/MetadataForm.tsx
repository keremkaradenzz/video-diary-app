import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { metadataSchema, type Metadata } from '@/features/videos/schema';

type Props = {
  initial?: Metadata;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (m: Metadata) => void;
};

type Errors = Partial<Record<keyof Metadata, string>>;

export function MetadataForm({ initial, submitLabel, loading, error, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [errors, setErrors] = useState<Errors>({});

  const submit = () => {
    const res = metadataSchema.safeParse({ name, description });
    if (!res.success) {
      const f = res.error.flatten().fieldErrors;
      setErrors({ name: f.name?.[0], description: f.description?.[0] });
      return;
    }
    setErrors({});
    onSubmit(res.data);
  };

  return (
    <View className="gap-4 p-4">
      <View className="gap-1">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          maxLength={80}
          className="rounded-lg border border-gray-300 px-3 py-3 text-base"
        />
        {errors.name && <Text className="text-sm text-red-600">{errors.name}</Text>}
      </View>
      <View className="gap-1">
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
          textAlignVertical="top"
          className="h-32 rounded-lg border border-gray-300 px-3 py-3 text-base"
        />
        {errors.description && <Text className="text-sm text-red-600">{errors.description}</Text>}
      </View>
      {error && <Text className="text-sm text-red-600">{error}</Text>}
      <Pressable
        onPress={submit}
        disabled={loading}
        className="items-center rounded-lg bg-blue-600 py-3 active:opacity-80 disabled:opacity-50">
        {loading ? <ActivityIndicator color="white" /> : <Text className="font-semibold text-white">{submitLabel}</Text>}
      </Pressable>
    </View>
  );
}
