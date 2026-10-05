import type { VideoPlayer as Player } from 'expo-video';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
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
  return (
    <View className="flex-1 gap-4">
      <VideoPlayer player={player} />
      <Scrubber duration={duration} start={startSec} clipLength={clipLength} onChange={onChangeStart} />
      <View className="px-4">
        <Button label="Next" onPress={onNext} />
      </View>
    </View>
  );
}
