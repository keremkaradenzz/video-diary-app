import * as SQLite from 'expo-sqlite';

// Append-only: each entry runs once, in order, and `PRAGMA user_version` records how many have run.
// Never edit an entry that has shipped; add a new one (for example an ALTER TABLE).
const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS videos (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     description TEXT NOT NULL DEFAULT '',
     uri TEXT NOT NULL,
     start_sec REAL NOT NULL,
     created_at TEXT NOT NULL
   );
   CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos (created_at DESC, id DESC);`,
];

async function migrate(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  for (let v = row?.user_version ?? 0; v < MIGRATIONS.length; v++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[v]);
      await db.execAsync(`PRAGMA user_version = ${v + 1}`);
    });
  }
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  dbPromise ??= SQLite.openDatabaseAsync('video-diary.db').then(async (db) => {
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await migrate(db);
    return db;
  });
  return dbPromise;
}
