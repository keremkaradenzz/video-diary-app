import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, dirname, join } from 'path';

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

const all = walk(__dirname);
const presentational = all.filter((f) => /\/components\/.*\.component\.tsx$/.test(f));
const strayComponentFiles = all.filter((f) => /\/components\/[^/]+$/.test(f));
const componentFolders = [...new Set(all.filter((f) => /\/components\/[^/]+\/[^/]+$/.test(f)).map(dirname))];

describe('architecture: presentational components', () => {
  it('finds components to check', () => {
    expect(presentational.length).toBeGreaterThan(5);
  });

  it.each(presentational)('%s has no data, router or store imports', (file) => {
    expect(FORBIDDEN.find((re) => re.test(read(file)))).toBeUndefined();
  });
});

describe('component folders', () => {
  it('keeps every component inside its own folder', () => {
    expect(strayComponentFiles).toEqual([]);
  });

  it.each(componentFolders)('%s follows Name/{Name.component.tsx, name.styles.ts, index.ts}', (folder) => {
    const name = basename(folder);
    const lower = name[0].toLowerCase() + name.slice(1);
    const component = join(folder, `${name}.component.tsx`);
    const styles = join(folder, `${lower}.styles.ts`);
    const allowed = [`${name}.component.tsx`, `${lower}.styles.ts`, 'index.ts', `${name}.component.test.tsx`];
    const files = readdirSync(folder);

    expect(name).toMatch(/^[A-Z][A-Za-z0-9]*$/);
    expect(files).toEqual(expect.arrayContaining([`${name}.component.tsx`, 'index.ts']));
    expect(files.filter((f) => !allowed.includes(f))).toEqual([]);
    expect(read(component)).toMatch(new RegExp(`export function ${name}\\b`));
    // index.ts is a single named re-export, never a star barrel.
    expect(read(join(folder, 'index.ts')).trim()).toBe(`export { ${name} } from './${name}.component';`);

    if (existsSync(styles)) {
      expect(read(styles)).toMatch(/^export const styles = \{/m);
      expect(read(component)).toContain(`from './${lower}.styles'`);
    }
  });
});

describe('naming conventions', () => {
  const sources = (dir: string) => code(__dirname).filter((f) => f.includes(`/${dir}/`));
  const stem = (f: string) => basename(f).replace(/\.tsx?$/, '');

  it.each(sources('hooks'))('%s: useXxx file exporting the same name', (file) => {
    expect(stem(file)).toMatch(/^use[A-Z][A-Za-z0-9]*$/);
    expect(read(file)).toMatch(new RegExp(`export (function|const) ${stem(file)}\\b`));
  });

  it.each(walk(join(__dirname, 'app')))('%s: route files are lowercase or [param]', (file) => {
    expect(stem(file)).toMatch(/^(_layout|index|[a-z][a-z-]*|\[[a-z]+\])$/);
  });

  it('has no star re-exports (barrels are single named re-exports)', () => {
    expect(code(__dirname).filter((f) => /^export \* /m.test(read(f)))).toEqual([]);
  });
});

describe('architecture: dependencies', () => {
  // crop builds on videos; the reverse would create a cycle.
  it.each(code(join(__dirname, 'features/videos')))('%s does not import the crop feature', (file) => {
    expect(read(file)).not.toMatch(/@\/features\/crop/);
  });

  // Server-state hooks live in one predictable place per feature.
  it('keeps useQuery/useMutation in queries.ts files', () => {
    const offenders = code(__dirname).filter(
      (f) => /\buse(Query|Mutation)\(/.test(read(f)) && basename(f) !== 'queries.ts',
    );
    expect(offenders).toEqual([]);
  });
});

describe('architecture: containers', () => {
  const screens = walk(join(__dirname, 'app')).filter(
    (f) => f.endsWith('.tsx') && !f.endsWith('_layout.tsx'),
  );

  it.each(screens)('%s does not touch data layers directly', (file) => {
    expect(read(file)).not.toMatch(
      /from '[^']*\/(store|queries|repo)'|from '@tanstack|from 'zustand'|from 'expo-sqlite'/,
    );
  });
});

describe('architecture: layers', () => {
  const importsOf = (f: string) => [...read(f).matchAll(/from '([^']+)'/g)].map((m) => m[1]);

  // shared/ and core/ sit below features/: they must not know about any feature.
  it.each([...code(join(__dirname, 'shared')), ...code(join(__dirname, 'core'))])(
    '%s does not import a feature',
    (file) => {
      expect(importsOf(file).filter((i) => i.startsWith('@/features'))).toEqual([]);
    },
  );

  // A feature's data/ folder (repo, schema, store, queries) never reaches into the UI or the router.
  const dataFiles = code(__dirname).filter((f) => /\/features\/[^/]+\/data\/[^/]+$/.test(f));
  it('finds data modules to check', () => {
    expect(dataFiles.length).toBeGreaterThan(3);
  });

  it.each(dataFiles)('%s has no UI, hook or router imports', (file) => {
    expect(
      importsOf(file).filter((i) => /\/components\/|\/hooks\/|^expo-router$|^react-native/.test(i)),
    ).toEqual([]);
  });
});
