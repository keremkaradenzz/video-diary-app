import { act, renderHook } from '@testing-library/react-native';

import { createQueryWrapper } from '@/test/query-wrapper';

// Same situation as Expo Go: the package throws while it is being imported.
jest.mock('expo-trim-video', () => {
  throw new Error("Cannot find native module 'ExpoTrimVideo'");
});
jest.mock('expo-file-system', () => ({ Paths: { document: 'doc' }, File: jest.fn() }));

// Importing queries must not touch expo-trim-video, otherwise the whole app crashes at startup.
import { isTrimUnavailable, useTrimVideo } from './queries';

describe('useTrimVideo without the native module', () => {
  it('loads without throwing and fails only when trimming is attempted', async () => {
    const { result } = renderHook(() => useTrimVideo(), { wrapper: createQueryWrapper() });

    let error: unknown;
    await act(async () => {
      error = await result.current.mutateAsync({ uri: 'file:///a.mp4', start: 0 }).catch((e) => e);
    });

    expect(isTrimUnavailable(error)).toBe(true);
    expect(isTrimUnavailable(new Error('something else'))).toBe(false);
  });
});
