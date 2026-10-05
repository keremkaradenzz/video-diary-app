import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { trimVideo } from 'expo-trim-video';

import { useCropStore } from '@/features/crop/store';
import { insertVideo } from '@/features/videos/repo';
import { createQueryWrapper } from '@/test/queryWrapper';

import { useMetadataStep } from './useMetadataStep';

const mockCopy = jest.fn();

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissAll: jest.fn() },
}));
jest.mock('expo-trim-video', () => ({ trimVideo: jest.fn() }));
jest.mock('expo-file-system', () => ({
  Paths: { document: 'doc' },
  File: jest.fn().mockImplementation(function (this: { uri: string; copy: unknown }, ...parts: string[]) {
    this.uri = `file:///${parts.join('/')}`;
    this.copy = (...args: unknown[]) => mockCopy(...args);
  }),
}));
jest.mock('@/features/videos/repo', () => ({
  insertVideo: jest.fn(),
  listVideos: jest.fn(),
  getVideo: jest.fn(),
  updateMetadata: jest.fn(),
}));

const mockedTrim = jest.mocked(trimVideo);
const mockedInsert = jest.mocked(insertVideo);

const setup = () => renderHook(() => useMetadataStep(), { wrapper: createQueryWrapper() });

describe('useMetadataStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCropStore.getState().reset();
    useCropStore.getState().setSource('file:///a.mp4', 20);
    useCropStore.getState().setStart(3);
  });

  it('sends the user back to step 1 when no video was picked', () => {
    useCropStore.getState().reset();
    const { result } = setup();
    expect(result.current.ready).toBe(false);
    expect(router.replace).toHaveBeenCalledWith('/crop');
  });

  it('trims, saves and closes the modal for valid metadata', async () => {
    mockedTrim.mockResolvedValue({ uri: 'file:///tmp/t.mp4' });
    const { result } = setup();

    act(() => {
      result.current.form.onChangeName('Trip');
      result.current.form.onChangeDescription('Beach');
    });
    act(() => result.current.form.onSubmit());

    await waitFor(() => expect(router.dismissAll).toHaveBeenCalledTimes(1));
    expect(mockedTrim).toHaveBeenCalledWith({ uri: 'file:///a.mp4', start: 3, end: 8 });
    // TanStack Query passes a context object as the second argument, so check only the first.
    expect(mockedInsert.mock.calls[0][0]).toEqual({
      name: 'Trip',
      description: 'Beach',
      uri: expect.stringMatching(/clip-\d+\.mp4$/),
      startSec: 3,
    });
  });

  it('shows validation errors and does not start trimming', () => {
    const { result } = setup();
    act(() => result.current.form.onSubmit());
    expect(result.current.form.errors.name).toBe('validation.nameRequired');
    expect(mockedTrim).not.toHaveBeenCalled();
    expect(mockedInsert).not.toHaveBeenCalled();
  });

  it('keeps the modal open and saves nothing when trimming fails', async () => {
    mockedTrim.mockRejectedValue(new Error('boom'));
    const { result } = setup();

    act(() => result.current.form.onChangeName('Trip'));
    act(() => result.current.form.onSubmit());

    await waitFor(() => expect(result.current.error).toBe('boom'));
    expect(mockedInsert).not.toHaveBeenCalled();
    expect(router.dismissAll).not.toHaveBeenCalled();
  });
});
