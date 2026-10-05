import { getDb } from '@/lib/db';

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

export async function listVideos(): Promise<Video[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>('SELECT * FROM videos ORDER BY created_at DESC');
  return rows.map(toVideo);
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
