import type { VideoPlayer as Player } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { VideoPlayer } from '@/components/VideoPlayer';

import { Scrubber } from './Scrubber';

type Props = {
  player: Player;
  duration: number;
  startSec: number;
  clipLength: number;
  onChangeStart: (start: number) => void;
  onNext: () => void;
};

export function TrimEditor({ player, duration, startSec, clipLength, onChangeStart, onNext }: Props) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 gap-4">
      <VideoPlayer player={player} />
      <Scrubber duration={duration} start={startSec} clipLength={clipLength} onChange={onChangeStart} />
      <View className="px-4">
        <Button label={t('crop.next')} onPress={onNext} />
      </View>
    </View>
  );
}
