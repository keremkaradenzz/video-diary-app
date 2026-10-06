import type { VideoPlayer as Player, VideoThumbnail } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';
import { StepBar } from '@/shared/ui/StepBar';
import { VideoPlayer } from '@/shared/media/components/VideoPlayer';
import { Filmstrip } from '@/features/crop/components/Filmstrip';
import { Scrubber } from '@/features/crop/components/Scrubber';

import { styles } from './TrimStep.styles';

type Props = {
  player: Player;
  frames: VideoThumbnail[];
  duration: number;
  startSec: number;
  clipLength: number;
  onChangeStart: (start: number) => void;
  onCommitStart: (start: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function TrimStep({
  player,
  frames,
  duration,
  startSec,
  clipLength,
  onChangeStart,
  onCommitStart,
  onNext,
  onBack,
}: Props) {
  const { t } = useTranslation();
  return (
    <Screen className={styles.container}>
      <StepBar step={2} onBack={onBack} />
      <Text className={styles.title}>{t('crop.trimHeading', { seconds: clipLength })}</Text>
      <View className={styles.player}>
        <VideoPlayer player={player} height={210} />
        <View className={styles.badge} pointerEvents="none">
          <Text className={styles.badgeText}>{t('crop.previewLabel', { seconds: clipLength })}</Text>
        </View>
      </View>
      <Filmstrip frames={frames} duration={duration} start={startSec} clipLength={clipLength} />
      <Scrubber
        duration={duration}
        start={startSec}
        clipLength={clipLength}
        onChange={onChangeStart}
        onCommit={onCommitStart}
      />
      <View className={styles.spacer} />
      <Button label={t('crop.next')} onPress={onNext} />
    </Screen>
  );
}
