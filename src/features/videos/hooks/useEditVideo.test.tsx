import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import { updateMetadata } from '@/features/videos/repo';
import type { Video } from '@/features/videos/types';
import { createQueryWrapper } from '@/test/queryWrapper';

import { useEditVideo } from './useEditVideo';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));
jest.mock('@/features/videos/repo', () => ({
  insertVideo: jest.fn(),
  listVideos: jest.fn(),
  getVideo: jest.fn(),
  updateMetadata: jest.fn(),
}));

const video: Video = {
  id: 7,
  name: 'Old',
  description: 'd',
  uri: 'file:///a.mp4',
  startSec: 1,
  createdAt: '2026-10-05T09:44:00.000Z',
};

const setup = () => renderHook(() => useEditVideo(video), { wrapper: createQueryWrapper() });

describe('useEditVideo', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts from the current name and description', () => {
    const { result } = setup();
    expect(result.current.form).toMatchObject({ name: 'Old', description: 'd' });
  });

  it('saves edited metadata and goes back', async () => {
    const { result } = setup();
    act(() => result.current.form.onChangeName('New'));
    act(() => result.current.form.onSubmit());

    await waitFor(() => expect(router.back).toHaveBeenCalledTimes(1));
    expect(jest.mocked(updateMetadata)).toHaveBeenCalledWith(7, { name: 'New', description: 'd' });
  });

  it('does not save an empty name', () => {
    const { result } = setup();
    act(() => result.current.form.onChangeName('  '));
    act(() => result.current.form.onSubmit());

    expect(result.current.form.errors.name).toBe('validation.nameRequired');
    expect(jest.mocked(updateMetadata)).not.toHaveBeenCalled();
    expect(router.back).not.toHaveBeenCalled();
  });
});
