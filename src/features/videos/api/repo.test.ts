const mockDb = { getAllAsync: jest.fn(), getFirstAsync: jest.fn(), runAsync: jest.fn() };

jest.mock('@/core/db', () => ({ getDb: () => Promise.resolve(mockDb) }));
// The document directory differs per install, so the repo must build URIs from it at read time.
jest.mock('expo-file-system', () => ({
  Paths: { document: 'doc' },
  File: jest.fn().mockImplementation(function (this: { uri: string }, ...parts: string[]) {
    this.uri = `file:///${parts.join('/')}`;
  }),
}));

import {
  countVideos,
  deleteVideo,
  getVideo,
  insertVideo,
  listVideos,
  PAGE_SIZE,
  updateMetadata,
} from './repo';

const row = {
  id: 1,
  name: 'a',
  description: '',
  uri: 'a.mp4',
  start_sec: 2.5,
  created_at: '2026-10-05T09:44:00.000Z',
};

describe('videos repo', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps snake_case rows to Video', async () => {
    mockDb.getAllAsync.mockResolvedValue([row]);
    expect(await listVideos()).toEqual([
      {
        id: 1,
        name: 'a',
        description: '',
        uri: 'file:///doc/a.mp4',
        startSec: 2.5,
        createdAt: row.created_at,
      },
    ]);
  });

  it('asks for the first page newest first', async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    await listVideos();
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringMatching(/ORDER BY created_at DESC, id DESC LIMIT \?/),
      PAGE_SIZE,
    );
  });

  it('continues after the cursor row instead of skipping by offset', async () => {
    mockDb.getAllAsync.mockResolvedValue([]);
    await listVideos({ createdAt: row.created_at, id: 5 });
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringMatching(
        /WHERE \(created_at, id\) < \(\?, \?\) ORDER BY created_at DESC, id DESC LIMIT \?/,
      ),
      row.created_at,
      5,
      PAGE_SIZE,
    );
    expect(mockDb.getAllAsync.mock.calls[0][0]).not.toMatch(/OFFSET/);
  });

  it('deleteVideo removes the row by id', async () => {
    await deleteVideo(4);
    expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM videos WHERE id = ?', 4);
  });

  it('countVideos returns the row count, 0 for an empty table', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ n: 42 });
    expect(await countVideos()).toBe(42);
    mockDb.getFirstAsync.mockResolvedValueOnce(null);
    expect(await countVideos()).toBe(0);
  });

  it('getVideo returns null when missing', async () => {
    mockDb.getFirstAsync.mockResolvedValue(null);
    expect(await getVideo(9)).toBeNull();
  });

  it('insertVideo returns the new id', async () => {
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 7 });
    expect(await insertVideo({ name: 'a', description: '', uri: 'u', startSec: 1 })).toBe(7);
  });

  it('updateMetadata writes name, description and id in order', async () => {
    await updateMetadata(3, { name: 'n', description: 'd' });
    expect(mockDb.runAsync).toHaveBeenCalledWith(expect.stringContaining('UPDATE videos'), 'n', 'd', 3);
  });

  it('stores only the file name, so the clip survives a changed container path', async () => {
    mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 1 });
    await insertVideo({
      name: 'a',
      description: '',
      uri: 'file:///var/mobile/Containers/Data/Application/OLD-UUID/Documents/clip-1.mp4',
      startSec: 1,
    });
    expect(mockDb.runAsync.mock.calls[0]).toContain('clip-1.mp4');
  });
});
