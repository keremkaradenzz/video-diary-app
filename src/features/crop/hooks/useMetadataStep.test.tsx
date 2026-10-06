import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { trimVideo } from 'expo-trim-video';

import { useCropStore } from '@/features/crop/model/store';
import { deleteFile } from '@/shared/utils/files';
import { insertVideo } from '@/features/videos/api/repo';
import i18n from '@/core/i18n';
import { createQueryWrapper } from '@/test/queryWrapper';

import { useMetadataStep } from './useMetadataStep';

const mockMove = jest.fn();

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));
jest.mock('@/shared/utils/files', () => ({ deleteIfCached: jest.fn(), deleteFile: jest.fn() }));
jest.mock('expo-trim-video', () => ({ trimVideo: jest.fn() }));
jest.mock('expo-file-system', () => ({
  Paths: { document: 'doc' },
  File: jest.fn().mockImplementation(function (this: { uri: string; move: unknown }, ...parts: string[]) {
    this.uri = `file:///${parts.join('/')}`;
    this.move = (...args: unknown[]) => mockMove(...args);
  }),
}));
jest.mock('@/features/videos/api/repo', () => ({
  insertVideo: jest.fn(),
  listVideos: jest.fn(),
  getVideo: jest.fn(),
  updateMetadata: jest.fn(),
}));

const mockedTrim = jest.mocked(trimVideo);
const mockedInsert = jest.mocked(insertVideo);

const setup = () => renderHook(() => useMetadataStep(), { wrapper: createQueryWrapper() });

describe('useMetadataStep', () => {
  beforeAll(() => i18n.changeLanguage('en'));
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

    await waitFor(() => expect(router.dismissTo).toHaveBeenCalledWith('/'));
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

  it('explains that a development build is needed when the native module is missing', async () => {
    mockedTrim.mockRejectedValue(Object.assign(new Error('missing'), { code: 'TRIM_UNAVAILABLE' }));
    const { result } = setup();

    act(() => result.current.form.onChangeName('Trip'));
    act(() => result.current.form.onSubmit());

    await waitFor(() =>
      expect(result.current.error).toBe('Cropping needs a development build and does not work in Expo Go.'),
    );
    expect(mockedInsert).not.toHaveBeenCalled();
  });

  it('keeps the modal open and saves nothing when trimming fails', async () => {
    mockedTrim.mockRejectedValue(new Error('boom'));
    const { result } = setup();

    act(() => result.current.form.onChangeName('Trip'));
    act(() => result.current.form.onSubmit());

    await waitFor(() => expect(result.current.error).toBe('boom'));
    expect(mockedInsert).not.toHaveBeenCalled();
    expect(router.dismissTo).not.toHaveBeenCalled();
  });

  it('deletes the trimmed clip when saving it fails', async () => {
    mockedTrim.mockResolvedValue({ uri: 'file:///tmp/t.mp4' });
    mockedInsert.mockRejectedValue(new Error('db down'));
    const { result } = setup();

    act(() => result.current.form.onChangeName('Trip'));
    act(() => result.current.form.onSubmit());

    await waitFor(() => expect(result.current.error).toBe('db down'));
    expect(deleteFile).toHaveBeenCalledWith(expect.stringMatching(/clip-\d+\.mp4$/));
    expect(router.dismissTo).not.toHaveBeenCalled();
  });
});
