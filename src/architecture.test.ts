import { readdirSync, readFileSync, statSync } from 'fs';
import { basename, join } from 'path';

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

describe('naming conventions', () => {
  const sources = (dir: string) =>
    walk(__dirname).filter((f) => f.includes(`/${dir}/`) && /\.tsx?$/.test(f) && !f.includes('.test.'));
  const stem = (f: string) => basename(f).replace(/\.tsx?$/, '');

  it.each(sources('components'))('%s: PascalCase file exporting the same name', (file) => {
    expect(stem(file)).toMatch(/^[A-Z][A-Za-z0-9]*$/);
    expect(readFileSync(file, 'utf8')).toMatch(new RegExp(`export (function|const) ${stem(file)}\\b`));
  });

  it.each(sources('hooks'))('%s: useXxx file exporting the same name', (file) => {
    expect(stem(file)).toMatch(/^use[A-Z][A-Za-z0-9]*$/);
    expect(readFileSync(file, 'utf8')).toMatch(new RegExp(`export (function|const) ${stem(file)}\\b`));
  });

  it.each(walk(join(__dirname, 'app')))('%s: route files are lowercase or [param]', (file) => {
    expect(stem(file)).toMatch(/^(_layout|index|[a-z][a-z-]*|\[[a-z]+\])$/);
  });
});

describe('architecture: dependencies', () => {
  const code = (dir: string) =>
    walk(dir).filter((f) => /\.tsx?$/.test(f) && !f.includes('.test.'));

  // crop builds on videos; the reverse would create a cycle.
  it.each(code(join(__dirname, 'features/videos')))('%s does not import the crop feature', (file) => {
    expect(readFileSync(file, 'utf8')).not.toMatch(/@\/features\/crop/);
  });

  // Server-state hooks live in one predictable place per feature.
  it('keeps useQuery/useMutation in queries.ts files', () => {
    const offenders = code(__dirname).filter(
      (f) => /\buse(Query|Mutation)\(/.test(readFileSync(f, 'utf8')) && basename(f) !== 'queries.ts',
    );
    expect(offenders).toEqual([]);
  });
});

describe('architecture: containers', () => {
  const screens = walk(join(__dirname, 'app')).filter((f) => f.endsWith('.tsx') && !f.endsWith('_layout.tsx'));

  it.each(screens)('%s does not touch data layers directly', (file) => {
    const src = readFileSync(file, 'utf8');
    expect(src).not.toMatch(/from '[^']*\/(store|queries|repo)'|from '@tanstack|from 'zustand'|from 'expo-sqlite'/);
  });
});
