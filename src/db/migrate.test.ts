import { migrate } from './migrate';

const fakeDb = (userVersion: number) => {
  const executed: string[] = [];
  const db = {
    getFirstAsync: jest.fn(async () => ({ user_version: userVersion })),
    withTransactionAsync: jest.fn(async (fn: () => Promise<void>) => fn()),
    execAsync: jest.fn(async (sql: string) => void executed.push(sql)),
  };
  return { db: db as unknown as Parameters<typeof migrate>[0], executed };
};

describe('migrate', () => {
  it('runs every migration on a fresh database and records the version after each', async () => {
    const { db, executed } = fakeDb(0);
    await migrate(db, ['A', 'B']);
    expect(executed).toEqual(['A', 'PRAGMA user_version = 1', 'B', 'PRAGMA user_version = 2']);
  });

  it('runs only the migrations it has not seen', async () => {
    const { db, executed } = fakeDb(1);
    await migrate(db, ['A', 'B']);
    expect(executed).toEqual(['B', 'PRAGMA user_version = 2']);
  });

  it('does nothing when up to date', async () => {
    const { db, executed } = fakeDb(2);
    await migrate(db, ['A', 'B']);
    expect(executed).toEqual([]);
  });
});
