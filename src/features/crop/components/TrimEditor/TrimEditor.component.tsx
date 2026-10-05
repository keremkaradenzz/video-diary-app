import type { VideoPlayer as Player, VideoThumbnail } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { StepBar } from '@/components/StepBar';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Filmstrip } from '@/features/crop/components/Filmstrip';
import { Scrubber } from '@/features/crop/components/Scrubber';

import { styles } from './trimEditor.styles';

type Props = {
  player: Player;
  frames: VideoThumbnail[];
  duration: number;
  startSec: number;
  clipLength: number;
  onChangeStart: (start: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function TrimEditor({ player, frames, duration, startSec, clipLength, onChangeStart, onNext, onBack }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View className={styles.container} style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <StepBar step={2} onBack={onBack} />
      <Text className={styles.title}>{t('crop.trimHeading', { seconds: clipLength })}</Text>
      <View className={styles.player}>
        <VideoPlayer player={player} />
        <View className={styles.badge} pointerEvents="none">
          <Text className={styles.badgeText}>{t('crop.previewLabel', { seconds: clipLength })}</Text>
        </View>
      </View>
      <Filmstrip frames={frames} duration={duration} start={startSec} clipLength={clipLength} />
      <Scrubber duration={duration} start={startSec} clipLength={clipLength} onChange={onChangeStart} />
      <View className={styles.spacer} />
      <Button label={t('crop.next')} onPress={onNext} />
    </View>
  );
}
