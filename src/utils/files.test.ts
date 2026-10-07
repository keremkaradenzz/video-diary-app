import { deleteIfCached } from './files';

const mockDelete = jest.fn();
let mockExists = true;

jest.mock('expo-file-system', () => ({
  Paths: { cache: { uri: 'file:///cache/' } },
  File: jest.fn().mockImplementation(function (this: Record<string, unknown>) {
    Object.defineProperty(this, 'exists', { get: () => mockExists });
    this.delete = () => mockDelete();
  }),
}));

describe('deleteIfCached', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExists = true;
  });

  it('deletes a file inside the cache directory', () => {
    deleteIfCached('file:///cache/ImagePicker/a.mp4');
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('never touches files outside the cache', () => {
    deleteIfCached('file:///Documents/clip.mp4');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('skips a file that is already gone', () => {
    mockExists = false;
    deleteIfCached('file:///cache/a.mp4');
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
