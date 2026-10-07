import * as SQLite from 'expo-sqlite';

import { migrate } from './migrate';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  dbPromise ??= SQLite.openDatabaseAsync('video-diary.db').then(async (db) => {
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await migrate(db);
    return db;
  });
  return dbPromise;
}
