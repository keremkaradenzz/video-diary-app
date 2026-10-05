import type { Metadata } from './schema';

/** A saved clip as stored in SQLite (see src/db). */
export type Video = Metadata & {
  id: number;
  uri: string;
  startSec: number;
  createdAt: string;
};
