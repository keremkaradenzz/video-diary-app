const mockDb = { getAllAsync: jest.fn(), getFirstAsync: jest.fn(), runAsync: jest.fn() };

jest.mock('@/lib/db', () => ({ getDb: () => Promise.resolve(mockDb) }));

import { getVideo, insertVideo, listVideos, updateMetadata } from './repo';

const row = {
  id: 1,
  name: 'a',
  description: '',
  uri: 'file:///a.mp4',
  start_sec: 2.5,
  created_at: '2026-10-05T09:44:00.000Z',
};

describe('videos repo', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps snake_case rows to Video', async () => {
    mockDb.getAllAsync.mockResolvedValue([row]);
    expect(await listVideos()).toEqual([
      { id: 1, name: 'a', description: '', uri: 'file:///a.mp4', startSec: 2.5, createdAt: row.created_at },
    ]);
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
});
