import type { Metadata } from './schema';

/** A saved clip as stored in SQLite (see lib/db.ts). */
export type Video = Metadata & {
  id: number;
  uri: string;
  startSec: number;
  createdAt: string;
};
