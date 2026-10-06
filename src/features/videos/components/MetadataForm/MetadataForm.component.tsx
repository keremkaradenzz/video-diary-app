import { Image } from 'expo-image';
import type { VideoThumbnail } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StepBar } from '@/components/StepBar';
import { DESCRIPTION_MAX, NAME_MAX, type MetadataErrors } from '@/features/videos/schema';

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
  /** Shows the step indicator when the form is part of the crop flow. */
  step?: number;
  onBack?: () => void;
  heading?: string;
  /** Small clip preview shown next to the heading. */
  thumbnail?: VideoThumbnail;
  duration?: string;
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
      {p.onBack && (p.step !== undefined ? <StepBar step={p.step} onBack={p.onBack} /> : <ScreenHeader onBack={p.onBack} />)}
      {(!!p.heading || !!p.thumbnail) && (
        <View className={styles.headingRow}>
          {p.thumbnail && (
            <View className={styles.thumb}>
              <Image source={p.thumbnail} style={StyleSheet.absoluteFill} contentFit="cover" />
              {!!p.duration && (
                <View className={styles.badge}>
                  <Text className={styles.badgeText}>{p.duration}</Text>
                </View>
              )}
            </View>
          )}
          {!!p.heading && <Text className={styles.heading}>{p.heading}</Text>}
        </View>
      )}
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
