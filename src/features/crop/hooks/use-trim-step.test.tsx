import { act, renderHook } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useCropStore } from '@/features/crop/model/store';
import { useClipPlayer } from '@/shared/media/hooks/use-clip-player';

import { useTrimStep } from './use-trim-step';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));
jest.mock('@/features/crop/api/queries', () => ({ useFilmstrip: () => ({ data: undefined }) }));
jest.mock('@/shared/media/hooks/use-clip-player', () => ({
  useClipPlayer: jest.fn(() => ({ id: 'player' })),
}));

describe('useTrimStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCropStore.getState().reset();
  });

  it('sends the user back to step 1 when no video was picked', () => {
    const { result } = renderHook(() => useTrimStep());
    expect(result.current.ready).toBe(false);
    expect(router.replace).toHaveBeenCalledWith('/crop');
  });

  it('loops a 5s window that follows the committed scrubber value', () => {
    useCropStore.getState().setSource('file:///a.mp4', 20);
    const { result } = renderHook(() => useTrimStep());

    expect(result.current.ready).toBe(true);
    expect(router.replace).not.toHaveBeenCalled();
    expect(useClipPlayer).toHaveBeenLastCalledWith('file:///a.mp4', { start: 0, length: 5 });

    act(() => result.current.onCommitStart(4));

    expect(result.current.startSec).toBe(4);
    expect(useClipPlayer).toHaveBeenLastCalledWith('file:///a.mp4', { start: 4, length: 5 });
  });

  it('only updates the displayed start while dragging, not the store or the player', () => {
    useCropStore.getState().setSource('file:///a.mp4', 20);
    const { result } = renderHook(() => useTrimStep());

    act(() => result.current.onChangeStart(3));

    expect(result.current.startSec).toBe(3);
    expect(useCropStore.getState().startSec).toBe(0);
    expect(useClipPlayer).toHaveBeenLastCalledWith('file:///a.mp4', { start: 0, length: 5 });
  });

  it('opens the metadata step on next', () => {
    useCropStore.getState().setSource('file:///a.mp4', 20);
    const { result } = renderHook(() => useTrimStep());
    act(() => result.current.onNext());
    expect(router.push).toHaveBeenCalledWith('/crop/metadata');
  });
});
