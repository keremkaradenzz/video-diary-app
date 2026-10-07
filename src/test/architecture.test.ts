import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, dirname, join } from 'path';

const SRC = join(__dirname, '..');

// Layout: Expo's guide (https://expo.dev/blog/expo-app-folder-structure-best-practices) taken one step further.
// Routes live in app/, the UI of each route in screens/, reusable UI in components/, reusable logic in hooks/.
// A screen folder has the same shape as src itself (components/ and hooks/), so code is easy to place.
// db/ holds the on-device SQLite layer, query/ the TanStack Query setup, i18n/ the translations and themes/
// the palette, the theme object and the Tailwind CSS entry.
const FOLDERS = [
  'app',
  'components',
  'constants',
  'db',
  'hooks',
  'i18n',
  'query',
  'screens',
  'test',
  'themes',
  'types',
  'utils',
];
const ROOT_FILES: string[] = [];
const SCREEN_ENTRIES = ['components', 'hooks', 'index.tsx'];

// Which folders each folder may import from (via the `@/` alias). Imports point down:
// app -> screens -> components / hooks -> db, query, utils -> constants, types.
// Parts of one screen import each other with relative paths, so screens never import `@/screens/...`.
const ALLOWED: Record<string, string[]> = {
  app: ['components', 'constants', 'db', 'hooks', 'i18n', 'query', 'screens', 'themes', 'types', 'utils'],
  screens: ['components', 'constants', 'hooks', 'themes', 'types', 'utils'],
  hooks: ['constants', 'db', 'hooks', 'query', 'types', 'utils'],
  components: ['components', 'constants', 'themes', 'types', 'utils'],
  db: ['constants', 'db', 'types', 'utils'],
  query: ['query'],
  utils: ['constants', 'types', 'utils'],
  i18n: ['i18n'],
  types: ['types', 'utils'],
  constants: ['constants'],
  themes: ['themes'],
};

// Components stay presentational: props in, JSX out. Data, navigation and side effects belong in hooks.
const FORBIDDEN = [
  /from 'expo-router'/,
  /from 'zustand'/,
  /from '@tanstack\/react-query'/,
  /from 'expo-sqlite'/,
  /from 'expo-image-picker'/,
  /from 'expo-trim-video'/,
  /from 'expo-file-system'/,
  /from '@\/db/,
  /from '@\/hooks\//,
];

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const code = (dir: string) => walk(dir).filter((f) => /\.tsx?$/.test(f) && !f.includes('.test.'));
// Quotes are normalised so the import checks hold whichever style the formatter produces.
const read = (f: string) => readFileSync(f, 'utf8').replace(/"/g, "'");
const importsOf = (f: string) => [...read(f).matchAll(/from '([^']+)'/g)].map((m) => m[1]);
const rel = (f: string) => f.slice(SRC.length + 1);
const folderOf = (file: string) => file.split('/')[0];

// `@/components/button` -> components, `@/db/videos` -> db.
const targetOf = (i: string) => (i.startsWith('@/') ? i.split('/')[1] : null);

const all = walk(SRC);
const sources = code(SRC).map(rel);

// File and folder names are kebab-case (the Expo template convention): `video-list`, `use-trim-step.ts`.
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const pascal = (kebab: string) => kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
const camel = (kebab: string) => {
  const p = pascal(kebab);
  return p[0].toLowerCase() + p.slice(1);
};
const stem = (f: string) => basename(f).replace(/\.tsx?$/, '');

describe('folder structure', () => {
  it('has the folders it documents under src/', () => {
    const dirs = readdirSync(SRC).filter((d) => statSync(join(SRC, d)).isDirectory());
    expect(dirs.sort()).toEqual([...FOLDERS].sort());
  });

  it('has no loose files at the src root', () => {
    const files = readdirSync(SRC).filter((d) => statSync(join(SRC, d)).isFile());
    expect(files.sort()).toEqual([...ROOT_FILES].sort());
  });

  it('keeps styles in the component file, not in a separate *.styles file', () => {
    expect(all.filter((f) => /\.styles\.[tj]sx?$/.test(f)).map(rel)).toEqual([]);
  });

  it('keeps tests next to the code, not in __tests__ folders', () => {
    expect(all.filter((f) => f.includes('__tests__')).map(rel)).toEqual([]);
  });
});

describe('imports point down', () => {
  it.each(sources.filter((f) => ALLOWED[folderOf(f)]))('%s imports only from folders it may use', (file) => {
    const allowed = ALLOWED[folderOf(file)];
    const bad = importsOf(join(SRC, file)).filter((i) => {
      const target = targetOf(i);
      return target !== null && !allowed.includes(target);
    });
    expect(bad).toEqual([]);
  });

  // A screen is self-contained: what two screens share moves to components/ or hooks/.
  it.each(sources.filter((f) => f.startsWith('screens/')))('%s does not import another screen', (file) => {
    expect(importsOf(join(SRC, file)).filter((i) => i.startsWith('@/screens/'))).toEqual([]);
  });
});

describe('routes (src/app)', () => {
  const routes = walk(join(SRC, 'app')).filter((f) => f.endsWith('.tsx') && !f.endsWith('_layout.tsx'));

  it('finds routes to check', () => {
    expect(routes.length).toBeGreaterThan(3);
  });

  it.each(routes.map(rel))('%s just renders a screen', (file) => {
    const text = read(join(SRC, file));
    expect(importsOf(join(SRC, file)).some((i) => i.startsWith('@/screens/'))).toBe(true);
    expect(text).not.toMatch(/from '@\/(hooks|db)|from '@tanstack|from 'zustand'|from 'expo-sqlite'/);
  });

  // Expo Router turns every file into a route, so names are lowercase, `[param]` or `_layout`.
  it.each(walk(join(SRC, 'app')).map(rel))('%s: route files are lowercase or [param]', (file) => {
    expect(stem(file)).toMatch(/^(_layout|index|[a-z][a-z-]*|\[[a-z]+\])$/);
  });
});

describe('components', () => {
  const components = sources.filter((f) => /^(components|screens\/[^/]+\/components)\//.test(f));

  it('finds components to check', () => {
    expect(components.length).toBeGreaterThan(8);
  });

  it.each(components)('%s has no data, router or store imports', (file) => {
    expect(FORBIDDEN.find((re) => re.test(read(join(SRC, file))))).toBeUndefined();
  });

  // One file per component, named after it: `button.tsx` exports Button.
  it.each(components)('%s exports the component named after the file', (file) => {
    const name = stem(file) === 'index' ? basename(dirname(file)) : stem(file);
    expect(read(join(SRC, file))).toMatch(new RegExp(`export function ${pascal(name)}\\b`));
  });
});

describe('screens', () => {
  const screens = readdirSync(join(SRC, 'screens'));

  it.each(screens)('%s has an index.tsx exporting the screen', (name) => {
    const index = join(SRC, 'screens', name, 'index.tsx');
    expect(existsSync(index)).toBe(true);
    expect(read(index)).toMatch(new RegExp(`export function ${pascal(name)}\\b`));
  });

  // The screen file sits next to a components/ and a hooks/ folder, never next to loose hook files.
  it.each(screens)('%s holds only index.tsx, components/ and hooks/', (name) => {
    expect(readdirSync(join(SRC, 'screens', name)).filter((e) => !SCREEN_ENTRIES.includes(e))).toEqual([]);
  });
});

describe('hooks and server state', () => {
  const hookFiles = sources.filter((f) => stem(f).startsWith('use-') || /(^|\/)hooks\//.test(f));

  it('finds hooks to check', () => {
    expect(hookFiles.length).toBeGreaterThan(10);
  });

  it.each(hookFiles)('%s: use-xxx file exporting useXxx', (file) => {
    expect(stem(file)).toMatch(/^use-[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(read(join(SRC, file))).toMatch(new RegExp(`export (function|const) ${camel(stem(file))}\\b`));
  });

  // Server-state hooks live in their own use-xxx file.
  it('keeps useQuery/useMutation inside hook files', () => {
    const offenders = sources.filter(
      (f) =>
        /\buse(Query|Mutation|Queries|InfiniteQuery)\(/.test(read(join(SRC, f))) &&
        !stem(f).startsWith('use-'),
    );
    expect(offenders).toEqual([]);
  });
});

describe('naming conventions', () => {
  // Every file and folder name, e.g. `use-trim-video.trim-unavailable.test.ts`, is checked part by part.
  // `_layout`, `[id]` and `index` are Expo Router / module conventions.
  it.each(all.map(rel))('%s: kebab-case name', (file) => {
    const parts = file.split(/[/.]/);
    const bad = parts.filter((p) => p && !KEBAB.test(p) && !/^(_layout|\[[a-z]+\])$/.test(p));
    expect(bad).toEqual([]);
  });

  it('has no star re-exports', () => {
    expect(sources.filter((f) => /^export \* /m.test(read(join(SRC, f))))).toEqual([]);
  });
});
