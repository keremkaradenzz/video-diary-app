import { getDb } from '@/core/db';

import type { Metadata } from './schema';
import type { Video } from './types';

type Row = {
  id: number;
  name: string;
  description: string;
  uri: string;
  start_sec: number;
  created_at: string;
};

const toVideo = (r: Row): Video => ({
  id: r.id,
  name: r.name,
  description: r.description,
  uri: r.uri,
  startSec: r.start_sec,
  createdAt: r.created_at,
});

export const PAGE_SIZE = 20;

/** One page of clips, newest first. The `(created_at, id)` index serves the ORDER BY. */
export async function listVideos(offset = 0, limit = PAGE_SIZE): Promise<Video[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>(
    'SELECT * FROM videos ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?',
    limit,
    offset,
  );
  return rows.map(toVideo);
}

export async function countVideos(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM videos');
  return row?.n ?? 0;
}

export async function getVideo(id: number): Promise<Video | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Row>('SELECT * FROM videos WHERE id = ?', id);
  return row ? toVideo(row) : null;
}

export async function insertVideo(v: Metadata & { uri: string; startSec: number }) {
  const db = await getDb();
  const res = await db.runAsync(
    'INSERT INTO videos (name, description, uri, start_sec, created_at) VALUES (?, ?, ?, ?, ?)',
    v.name,
    v.description,
    v.uri,
    v.startSec,
    new Date().toISOString(),
  );
  return res.lastInsertRowId;
}

export async function updateMetadata(id: number, m: Metadata) {
  const db = await getDb();
  await db.runAsync('UPDATE videos SET name = ?, description = ? WHERE id = ?', m.name, m.description, id);
}
