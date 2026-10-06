import { act, renderHook } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

import { useCropStore } from '@/features/crop/model/store';
import i18n from '@/core/i18n';

import { useSelectStep } from './useSelectStep';

jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));

const pick = jest.mocked(ImagePicker.launchImageLibraryAsync);
const result = (value: unknown) => value as ImagePicker.ImagePickerResult;
const picked = (ms: number | null) =>
  result({ canceled: false, assets: [{ uri: 'file:///a.mp4', duration: ms }] });

describe('useSelectStep', () => {
  beforeAll(() => i18n.changeLanguage('en'));
  beforeEach(() => {
    jest.clearAllMocks();
    useCropStore.getState().reset();
  });

  const run = async () => {
    const hook = renderHook(() => useSelectStep());
    await act(async () => {
      await hook.result.current.onPick();
    });
    return hook.result;
  };

  it('does nothing when the picker is cancelled', async () => {
    pick.mockResolvedValue(result({ canceled: true, assets: null }));
    const r = await run();
    expect(r.current.error).toBeNull();
    expect(useCropStore.getState().sourceUri).toBeNull();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('rejects videos shorter than 5 seconds', async () => {
    pick.mockResolvedValue(picked(4000));
    const r = await run();
    expect(r.current.error).toBe('Video must be at least 5 seconds long.');
    expect(useCropStore.getState().sourceUri).toBeNull();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('stores the video (duration in seconds) and opens the crop step', async () => {
    pick.mockResolvedValue(picked(12000));
    const r = await run();
    expect(r.current.error).toBeNull();
    expect(useCropStore.getState()).toMatchObject({ sourceUri: 'file:///a.mp4', duration: 12 });
    expect(router.push).toHaveBeenCalledWith('/crop/trim');
  });
});
