import type { SQLiteDatabase } from 'expo-sqlite';

import { MIGRATIONS } from './migrations';

/** Runs every migration the database has not seen yet, each in its own transaction. */
export async function migrate(db: SQLiteDatabase, migrations: readonly string[] = MIGRATIONS) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  for (let v = row?.user_version ?? 0; v < migrations.length; v++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(migrations[v]);
      await db.execAsync(`PRAGMA user_version = ${v + 1}`);
    });
  }
}
