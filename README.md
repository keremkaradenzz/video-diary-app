# Video Diary

Import a video, crop a 5-second segment, add a name and description, and keep it in a list.

## Stack

Expo (SDK 57) · Expo Router · Zustand · TanStack Query · expo-trim-video · NativeWind · expo-video · expo-sqlite · Reanimated · Zod

## Setup

```bash
npm install
npx expo run:ios      # or: npx expo run:android
```

`expo-trim-video` is a native module, so the app needs a **development build**. Expo Go will not work.

Scripts: `npm test`, `npm run typecheck`, `npm run lint`.

## Usage

1. Tap **New video** and choose a video (at least 5 seconds long).
2. Drag the slider to pick where the 5-second segment starts. The preview loops that segment.
3. Tap **Next**, enter a name and description, then tap **Crop & save**.
4. Open a video from the list to see its details. Tap **Edit** to change its name or description.

## Architecture

Container/Presentational for screens, Hooks for logic.

```
route (container)  ->  controller hook  ->  data hooks / store / repo
       |
       +--------->  presentational component (props in, JSX out)
```

| Layer | Where | May use |
|---|---|---|
| Container | `src/app/**` (route files, ~10 lines) | controller hooks, view components |
| Controller hook | `src/features/*/hooks/` | router, store, queries, other hooks |
| Data hooks | `src/features/*/queries.ts`, `crop/store.ts` | repo, TanStack Query, Zustand |
| Presentational | `src/components/`, `src/features/*/components/` | props only; no router, store, queries, SQLite |

```
src/
  app/          containers: /, /videos/[id], /videos/[id]/edit, /crop/*
  components/   domain-agnostic UI, one folder per component: Button, Loader, Notice, VideoPlayer
  hooks/        domain-agnostic hooks: useClipPlayer
  features/     domain code; crop may depend on videos, never the reverse
    crop/       components (SelectVideo, TrimEditor, Scrubber), hooks (useSelectStep, useTrimStep, useMetadataStep, ...), store, queries, constants
    videos/     components (VideoList, VideoDetails, MetadataForm), hooks, types, schema, repo, queries
  db/           SQLite connection and schema (index.ts); migrations will live here
  i18n/         setup (index.ts) and locales/ (en.ts, tr.ts)
```

Every component is a folder with the same three files:

```
Button/
  Button.component.tsx   the component (props in, JSX out)
  button.styles.ts       export const styles = { container: '...', label: '...' }
  index.ts               export { Button } from './Button.component';
```

Class names stay complete literal strings so Tailwind can find them (`tailwind.config.js` scans `src/**/*.{ts,tsx}`). `.vscode/settings.json` points Tailwind IntelliSense at `styles = { ... }` objects. Tests sit in the same folder as `Name.component.test.tsx`.

### Naming

| What | Convention | Example |
|---|---|---|
| Component folder | `PascalCase/`, with `Name.component.tsx`, `name.styles.ts`, `index.ts` | `VideoList/VideoList.component.tsx` |
| Styles file | `camelCase.styles.ts`, one `styles` object of literal class strings | `videoList.styles.ts` |
| Hook file | `useXxx.ts`, file name = export | `useTrimStep.ts` |
| Route file | lowercase, `[param]`, `_layout`; collection name is plural, same as the feature | `videos/[id]/edit.tsx` |
| Route default export | `<Name>Screen` | `VideoDetailsScreen` |
| Data modules | lowercase noun, one role each, flat at the feature root | `repo.ts` (SQLite), `queries.ts` (TanStack Query hooks), `store.ts` (Zustand), `schema.ts` (Zod validation), `types.ts` (entity types), `constants.ts` |
| Tests | next to the code, `*.test.ts` | `schema.test.ts` |
| Imports | `@/` across folders, `./` inside a folder | |
| `index.ts` | a single named re-export in component folders, or a module entry (`i18n/index.ts`, `db/index.ts`); never `export *` | |

When a feature grows past roughly eight root files, group its data modules into a `data/` folder; until then flat names stay easy to find.

`src/architecture.test.ts` enforces this, including the component folder layout. It also fails if a presentational component imports the router, store, queries, SQLite or a hook, if a container reaches into the data layer directly, if `videos` imports `crop`, or if `useQuery`/`useMutation` appear outside a `queries.ts`.

Trimmed clips are copied into the app's document directory and listed from SQLite.

## i18n

All UI text lives in `src/i18n/locales/` (`en.ts`, `tr.ts`) and is read with `t('section.key')` from `react-i18next`. The language follows the device (English if unsupported). `t()` keys are type-checked against `en.ts`, and `tr.ts` is typed as `typeof en`, so a missing key fails `npm run typecheck`. Validation errors from Zod are keys (`validation.*`) translated by the form.

To add a language: create `locales/<code>.ts` typed as `typeof en` and register it in `src/i18n/index.ts`.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org). A husky `commit-msg` hook runs commitlint and rejects anything else.

```
feat(crop): add scrubber
fix: keep clip after app restart
docs: update setup steps
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
