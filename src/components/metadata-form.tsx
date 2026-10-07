import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { DESCRIPTION_MAX, NAME_MAX } from '@/utils/video-schema';
import type { MetadataFormFields } from '@/types/video';

type Props = MetadataFormFields & {
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  /** Rendered above the fields: a step bar, a back button, a heading. */
  header?: ReactNode;
};

export function MetadataForm(p: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <ScrollView
        contentContainerClassName={styles.container}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {p.header}
        <View className={styles.field}>
          <View className={styles.labelRow}>
            <Text className={styles.label}>{t('form.name')}</Text>
            <Text className={styles.counter}>
              {p.name.length} / {NAME_MAX}
            </Text>
          </View>
          <TextInput
            value={p.name}
            onChangeText={p.onChangeName}
            maxLength={NAME_MAX + 20}
            editable={!p.loading}
            accessibilityLabel={t('form.name')}
            className={`${styles.input} ${p.errors.name ? styles.inputError : ''}`}
          />
          {p.errors.name && (
            <Animated.Text entering={FadeInDown} className={styles.error}>
              {t(p.errors.name)}
            </Animated.Text>
          )}
        </View>
        <View className={styles.field}>
          <View className={styles.labelRow}>
            <Text className={styles.label}>
              {t('form.description')} <Text className={styles.optional}>({t('form.optional')})</Text>
            </Text>
            <Text className={styles.counter}>
              {p.description.length} / {DESCRIPTION_MAX}
            </Text>
          </View>
          <TextInput
            value={p.description}
            onChangeText={p.onChangeDescription}
            multiline
            textAlignVertical="top"
            editable={!p.loading}
            accessibilityLabel={t('form.description')}
            className={`${styles.textarea} ${p.errors.description ? styles.inputError : ''}`}
          />
          {p.errors.description && (
            <Animated.Text entering={FadeInDown} className={styles.error}>
              {t(p.errors.description)}
            </Animated.Text>
          )}
        </View>
        {p.error && (
          <Animated.Text entering={FadeInDown} className={styles.error}>
            {p.error}
          </Animated.Text>
        )}
        <Button label={p.submitLabel} onPress={p.onSubmit} loading={p.loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = {
  container: 'gap-5 px-4 pb-4',
  field: 'gap-2',
  labelRow: 'flex-row items-baseline justify-between',
  label: 'text-base font-bold text-slate-900',
  optional: 'font-normal text-slate-600',
  counter: 'text-sm text-slate-600',
  input:
    'h-14 rounded-2xl border border-slate-300 bg-white px-4 pb-1 text-base text-slate-900 focus:border-2 focus:border-brand',
  textarea:
    'h-32 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-2 focus:border-brand',
  inputError: 'border-2 border-red-600',
  error: 'text-sm font-medium text-red-700',
};
