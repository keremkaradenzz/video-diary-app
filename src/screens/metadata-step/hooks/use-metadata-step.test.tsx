import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { trimVideo } from 'expo-trim-video';

import { useCropStore } from '@/hooks/use-crop-store';
import { deleteFile } from '@/utils/files';
import { generateThumbnails, primeThumbnail } from '@/utils/thumbnails';
import { insertVideo } from '@/db/videos';
import i18n from '@/i18n';
import { createQueryWrapper } from '@/test/query-wrapper';

import { useMetadataStep } from './use-metadata-step';

const mockMove = jest.fn();

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));
jest.mock('@/utils/files', () => ({ deleteIfCached: jest.fn(), deleteFile: jest.fn() }));
jest.mock('@/utils/thumbnails', () => ({
  // Pending by default, so the preview query does not update state after a test has finished.
  generateThumbnails: jest.fn(() => new Promise(() => {})),
  primeThumbnail: jest.fn().mockResolvedValue(undefined),
  clipThumbKey: (uri: string) => `key:${uri}`,
}));
jest.mock('expo-trim-video', () => ({ trimVideo: jest.fn() }));
jest.mock('expo-file-system', () => ({
  Paths: { document: 'doc' },
  File: jest.fn().mockImplementation(function (this: { uri: string; move: unknown }, ...parts: string[]) {
    this.uri = `file:///${parts.join('/')}`;
    this.move = (...args: unknown[]) => mockMove(...args);
  }),
}));
jest.mock('@/db/videos', () => ({
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

  it('caches the preview frame for the new clip before saving it, so the list does not decode it again', async () => {
    mockedTrim.mockResolvedValue({ uri: 'file:///tmp/t.mp4' });
    jest.mocked(generateThumbnails).mockResolvedValueOnce([{ frame: 'preview' }] as never);
    const { result } = setup();
    await waitFor(() => expect(result.current.thumbnail).toBeDefined());

    act(() => result.current.form.onChangeName('Trip'));
    act(() => result.current.form.onSubmit());

    await waitFor(() => expect(router.dismissTo).toHaveBeenCalledWith('/'));
    const prime = jest.mocked(primeThumbnail);
    expect(prime).toHaveBeenCalledWith(expect.stringMatching(/^key:.*clip-\d+\.mp4$/), { frame: 'preview' });
    expect(prime.mock.invocationCallOrder[0]).toBeLessThan(mockedInsert.mock.invocationCallOrder[0]);
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
