import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/shared/components/Button';
import { Screen } from '@/shared/components/Screen';
import { DESCRIPTION_MAX, NAME_MAX } from '@/features/videos/data/schema';
import type { MetadataFormFields } from '@/features/videos/data/types';

import { styles } from './metadataForm.styles';

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
