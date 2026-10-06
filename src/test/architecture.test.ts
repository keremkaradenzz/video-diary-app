import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, dirname, join } from 'path';

const SRC = join(__dirname, '..');

// Presentational components (every `ui/` folder: feature `ui/`, `shared/ui`, `shared/media/ui`) stay pure:
// props in, JSX out. Data, navigation and side effects belong in hooks and containers.
const FORBIDDEN = [
  /from 'expo-router'/,
  /from 'zustand'/,
  /from '@tanstack\/react-query'/,
  /from 'expo-sqlite'/,
  /from 'expo-image-picker'/,
  /from 'expo-trim-video'/,
  /from 'expo-file-system'/,
  /from '@\/core\/db'/,
  /from '[^']*\/(store|queries|repo)'/,
  /from '[^']*\/hooks\//,
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

const all = walk(SRC);
// A component folder sits directly inside a `ui/` folder.
const COMPONENT_DIR = /\/ui\/[^/]+\/[^/]+$/;
const presentational = all.filter((f) => /\/ui\/[^/]+\/index\.tsx$/.test(f));
const strayComponentFiles = all.filter((f) => /\/ui\/[^/]+$/.test(f));
const componentFolders = [...new Set(all.filter((f) => COMPONENT_DIR.test(f)).map(dirname))];

const features = readdirSync(join(SRC, 'features'));

// File and folder names are kebab-case (the Expo template convention): `video-list`, `use-trim-step.ts`.
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const pascal = (kebab: string) => kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
const camel = (kebab: string) => {
  const p = pascal(kebab);
  return p[0].toLowerCase() + p.slice(1);
};

describe('architecture: presentational components', () => {
  it('finds components to check', () => {
    expect(presentational.length).toBeGreaterThan(5);
  });

  it.each(presentational.map(rel))('%s has no data, router or store imports', (file) => {
    expect(FORBIDDEN.find((re) => re.test(read(join(SRC, file))))).toBeUndefined();
  });
});

describe('component folders', () => {
  it('keeps every component inside its own folder', () => {
    expect(strayComponentFiles.map(rel)).toEqual([]);
  });

  it.each(componentFolders.map(rel))('%s follows name/{index.tsx, name.styles.ts}', (folderRel) => {
    const folder = join(SRC, folderRel);
    const name = basename(folder);
    const component = join(folder, 'index.tsx');
    const styles = join(folder, `${name}.styles.ts`);
    const allowed = ['index.tsx', `${name}.styles.ts`, `${name}.test.tsx`];
    const files = readdirSync(folder);

    expect(name).toMatch(KEBAB);
    expect(files).toContain('index.tsx');
    expect(files.filter((f) => !allowed.includes(f))).toEqual([]);
    expect(read(component)).toMatch(new RegExp(`export function ${pascal(name)}\\b`));

    if (existsSync(styles)) {
      expect(read(styles)).toMatch(/^export const styles = \{/m);
      expect(read(component)).toContain(`from './${name}.styles'`);
    }
  });
});

describe('naming conventions', () => {
  const stem = (f: string) => basename(f).replace(/\.tsx?$/, '');

  it.each(
    code(SRC)
      .filter((f) => f.includes('/hooks/'))
      .map(rel),
  )('%s: use-xxx file exporting useXxx', (file) => {
    expect(stem(file)).toMatch(/^use-[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(read(join(SRC, file))).toMatch(new RegExp(`export (function|const) ${camel(stem(file))}\\b`));
  });

  // Every file and folder name, e.g. `queries.trim-unavailable.test.ts` is checked as `queries`,
  // `trim-unavailable`, `test`. `_layout`, `[id]` and `index` are Expo Router / module conventions.
  it.each(all.map(rel))('%s: kebab-case name', (file) => {
    const parts = file.split(/[/.]/);
    const bad = parts.filter((p) => p && !KEBAB.test(p) && !/^(_layout|\[[a-z]+\])$/.test(p));
    expect(bad).toEqual([]);
  });

  it.each(walk(join(SRC, 'app')).map(rel))('%s: route files are lowercase or [param]', (file) => {
    expect(stem(file)).toMatch(/^(_layout|index|[a-z][a-z-]*|\[[a-z]+\])$/);
  });

  it('has no star re-exports (barrels are single named re-exports)', () => {
    expect(
      code(SRC)
        .filter((f) => /^export \* /m.test(read(f)))
        .map(rel),
    ).toEqual([]);
  });
});

describe('architecture: features', () => {
  // crop builds on videos; the reverse would create a cycle.
  it.each(code(join(SRC, 'features/videos')).map(rel))('%s does not import the crop feature', (file) => {
    expect(read(join(SRC, file))).not.toMatch(/@\/features\/crop/);
  });

  // A feature's public API is its index.ts. Anything outside the feature (routes, other features)
  // goes through it, so inner folders can be reorganised without touching callers.
  it.each(
    features.flatMap((feature) =>
      code(SRC)
        .filter((f) => !f.startsWith(join(SRC, 'features', feature) + '/'))
        .map((f) => [feature, rel(f)] as const),
    ),
  )('%s is only imported through its index: %s', (feature, file) => {
    const deep = importsOf(join(SRC, file)).filter((i) => i.startsWith(`@/features/${feature}/`));
    expect(deep).toEqual([]);
  });

  it.each(features)('%s has an index.ts public API', (feature) => {
    expect(existsSync(join(SRC, 'features', feature, 'index.ts'))).toBe(true);
  });

  // Server-state hooks live in one predictable place per feature.
  it('keeps useQuery/useMutation in api/queries.ts files', () => {
    const offenders = code(SRC).filter(
      (f) => /\buse(Query|Mutation|Queries|InfiniteQuery)\(/.test(read(f)) && !f.endsWith('/api/queries.ts'),
    );
    expect(offenders.map(rel)).toEqual([]);
  });
});

describe('architecture: containers', () => {
  const screens = walk(join(SRC, 'app')).filter((f) => f.endsWith('.tsx') && !f.endsWith('_layout.tsx'));

  it.each(screens.map(rel))('%s does not touch data layers directly', (file) => {
    expect(read(join(SRC, file))).not.toMatch(
      /from '[^']*\/(store|queries|repo)'|from '@tanstack|from 'zustand'|from 'expo-sqlite'/,
    );
  });
});

describe('architecture: layers', () => {
  // shared/ and core/ sit below features/: they must not know about any feature.
  it.each([...code(join(SRC, 'shared')), ...code(join(SRC, 'core'))].map(rel))(
    '%s does not import a feature',
    (file) => {
      expect(importsOf(join(SRC, file)).filter((i) => i.startsWith('@/features'))).toEqual([]);
    },
  );

  // core/ is the lowest layer: it never reaches into shared/.
  it.each(code(join(SRC, 'core')).map(rel))('%s does not import shared', (file) => {
    expect(importsOf(join(SRC, file)).filter((i) => i.startsWith('@/shared'))).toEqual([]);
  });

  // api/ (SQLite, TanStack Query) and model/ (schema, types, store) never reach into the UI or router.
  const layerFiles = (layer: string) =>
    code(SRC).filter((f) => new RegExp(`/features/[^/]+/${layer}/[^/]+$`).test(f));
  const noUi = (i: string) => /\/ui\/|\/hooks\/|^expo-router$|^react-native/.test(i);

  it('finds api and model modules to check', () => {
    expect(layerFiles('api').length).toBeGreaterThan(2);
    expect(layerFiles('model').length).toBeGreaterThan(2);
  });

  it.each([...layerFiles('api'), ...layerFiles('model')].map(rel))(
    '%s has no UI, hook or router imports',
    (file) => {
      expect(importsOf(join(SRC, file)).filter(noUi)).toEqual([]);
    },
  );

  // model/ is pure: it may not depend on api/.
  it.each(layerFiles('model').map(rel))('%s does not import api', (file) => {
    expect(importsOf(join(SRC, file)).filter((i) => /\/api\//.test(i))).toEqual([]);
  });
});
