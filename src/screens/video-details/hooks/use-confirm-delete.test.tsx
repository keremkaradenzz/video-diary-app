import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import type { AlertButton } from 'react-native';

import i18n from '@/i18n';
import { deleteVideo } from '@/db/videos';
import type { Video } from '@/types/video';
import { deleteFile } from '@/utils/files';
import { createQueryWrapper } from '@/test/query-wrapper';

import { useConfirmDelete } from './use-confirm-delete';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
}));
jest.mock('@/db/videos', () => ({
  deleteVideo: jest.fn(),
  toCursor: jest.fn(),
}));
jest.mock('@/utils/files', () => ({ deleteFile: jest.fn() }));

const video: Video = {
  id: 7,
  name: 'a',
  description: '',
  uri: 'file:///doc/a.mp4',
  startSec: 1,
  createdAt: '2026-10-05T09:44:00.000Z',
};

const setup = () => renderHook(() => useConfirmDelete(video), { wrapper: createQueryWrapper() });

/** Opens the confirmation and returns a lookup for its buttons by label. */
const openConfirm = (result: ReturnType<typeof setup>['result']) => {
  act(() => {
    result.current.onDelete();
  });
  const buttons = jest.mocked(Alert.alert).mock.calls[0][2] as AlertButton[];
  return (text: string) => buttons.find((b) => b.text === text)!;
};

describe('useConfirmDelete', () => {
  beforeAll(() => i18n.changeLanguage('en'));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  it('asks before deleting and deletes nothing on cancel', () => {
    const { result } = setup();
    const button = openConfirm(result);

    expect(button('Cancel').style).toBe('cancel');
    expect(deleteVideo).not.toHaveBeenCalled();
    expect(deleteFile).not.toHaveBeenCalled();
  });

  it('removes the row, then the file, then goes back', async () => {
    const { result } = setup();
    const button = openConfirm(result);

    act(() => button('Delete').onPress?.());

    await waitFor(() => expect(router.back).toHaveBeenCalledTimes(1));
    expect(deleteVideo).toHaveBeenCalledWith(7);
    expect(deleteFile).toHaveBeenCalledWith(video.uri);
    expect(jest.mocked(deleteVideo).mock.invocationCallOrder[0]).toBeLessThan(
      jest.mocked(deleteFile).mock.invocationCallOrder[0],
    );
  });

  it('keeps the file and stays on the screen when the row cannot be deleted', async () => {
    jest.mocked(deleteVideo).mockRejectedValueOnce(new Error('db'));
    const { result } = setup();
    const button = openConfirm(result);

    act(() => button('Delete').onPress?.());

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('The clip could not be deleted. Please try again.'),
    );
    expect(deleteFile).not.toHaveBeenCalled();
    expect(router.back).not.toHaveBeenCalled();
  });
});
