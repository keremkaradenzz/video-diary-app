import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// Presentational components (src/components, src/features/*/components) must stay pure:
// props in, JSX out. Data, navigation and side effects belong in hooks and containers.
const FORBIDDEN = [
  /from 'expo-router'/,
  /from 'zustand'/,
  /from '@tanstack\/react-query'/,
  /from 'expo-sqlite'/,
  /from 'expo-image-picker'/,
  /from 'expo-trim-video'/,
  /from 'expo-file-system'/,
  /from '@\/lib\/db'/,
  /from '[^']*\/(store|queries|repo)'/,
  /from '[^']*\/hooks\//,
];

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const presentational = walk(__dirname).filter((f) => /\/components\/.*\.tsx$/.test(f));

describe('architecture: presentational components', () => {
  it('finds components to check', () => {
    expect(presentational.length).toBeGreaterThan(5);
  });

  it.each(presentational)('%s has no data, router or store imports', (file) => {
    const src = readFileSync(file, 'utf8');
    const hit = FORBIDDEN.find((re) => re.test(src));
    expect(hit).toBeUndefined();
  });
});

describe('architecture: containers', () => {
  const screens = walk(join(__dirname, 'app')).filter((f) => f.endsWith('.tsx') && !f.endsWith('_layout.tsx'));

  it.each(screens)('%s does not touch data layers directly', (file) => {
    const src = readFileSync(file, 'utf8');
    expect(src).not.toMatch(/from '[^']*\/(store|queries|repo)'|from '@tanstack|from 'zustand'|from 'expo-sqlite'/);
  });
});
