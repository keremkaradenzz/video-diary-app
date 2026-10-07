// expo-video needs its native module at import time, which Jest does not have.
jest.mock('@/utils/thumbnails', () => ({ generateThumbnails: jest.fn(async () => []) }));

// Feature barrels pull in every component, and Reanimated needs its native runtime at import time.
// Components only use Animated.View/Text and the FadeInDown entering preset.
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factories cannot use imports
  const { View, Text } = require('react-native');
  const entering: { delay: () => unknown } = { delay: () => entering };
  return { __esModule: true, default: { View, Text }, FadeInDown: entering };
});

// Same reason: feature barrels import VideoPlayer, which needs expo-video's native module.
jest.mock('expo-video', () => ({
  VideoView: 'VideoView',
  useVideoPlayer: jest.fn(),
  createVideoPlayer: jest.fn(),
}));
