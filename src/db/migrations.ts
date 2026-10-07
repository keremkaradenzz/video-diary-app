// Append-only: each entry runs once, in order, and `PRAGMA user_version` records how many have run.
// Never edit an entry that has shipped; add a new one (for example an ALTER TABLE).
export const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS videos (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     description TEXT NOT NULL DEFAULT '',
     uri TEXT NOT NULL,
     start_sec REAL NOT NULL,
     created_at TEXT NOT NULL
   );
   CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos (created_at DESC, id DESC);`,
  // Clips used to be stored as absolute file URIs, which break when the app container path changes
  // (every reinstall and update on iOS). Keep only the file name; the repo resolves it at read time.
  `UPDATE videos SET uri = replace(uri, rtrim(uri, replace(uri, '/', '')), '') WHERE uri LIKE '%/%';`,
];
