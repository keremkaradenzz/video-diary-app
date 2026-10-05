import { act, renderHook } from '@testing-library/react-native';
import { trimVideo } from 'expo-trim-video';

import { createQueryWrapper } from '@/test/queryWrapper';

import { useTrimVideo } from './queries';

const mockCopy = jest.fn();

jest.mock('expo-trim-video', () => ({ trimVideo: jest.fn() }));
jest.mock('expo-file-system', () => ({
  Paths: { document: 'doc' },
  File: jest.fn().mockImplementation(function (this: { uri: string; copy: unknown }, ...parts: string[]) {
    this.uri = `file:///${parts.join('/')}`;
    this.copy = (...args: unknown[]) => mockCopy(...args);
  }),
}));

const mockedTrim = jest.mocked(trimVideo);

describe('useTrimVideo', () => {
  beforeEach(() => jest.clearAllMocks());

  it('trims a 5s window and copies the result into the document directory', async () => {
    mockedTrim.mockResolvedValue({ uri: 'file:///tmp/t.mp4' });
    const { result } = renderHook(() => useTrimVideo(), { wrapper: createQueryWrapper() });

    let out: unknown;
    await act(async () => {
      out = await result.current.mutateAsync({ uri: 'file:///src.mp4', start: 2 });
    });

    expect(mockedTrim).toHaveBeenCalledWith({ uri: 'file:///src.mp4', start: 2, end: 7 });
    expect(mockCopy).toHaveBeenCalledTimes(1);
    expect(out).toEqual({ uri: expect.stringMatching(/^file:\/\/\/doc\/clip-\d+\.mp4$/) });
  });

  it('does not copy anything when trimming fails', async () => {
    mockedTrim.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useTrimVideo(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await expect(result.current.mutateAsync({ uri: 'file:///src.mp4', start: 0 })).rejects.toThrow('boom');
    });

    expect(mockCopy).not.toHaveBeenCalled();
  });
});
