# Video Diary

Import a video, crop a 5-second segment, add a name and description, and keep it in a list.

## Stack

Expo (SDK 57) · Expo Router · Zustand · TanStack Query · expo-trim-video · NativeWind · expo-video · expo-sqlite · Reanimated · Zod

## Setup

```bash
# npm
npm install
npx expo run:ios      # or: npx expo run:android

# pnpm (Node 18.12+ for pnpm 10; the latest pnpm needs Node 22.13+)
pnpm install
pnpm exec expo run:ios      # or: pnpm exec expo run:android
```

Both lockfiles are committed (`package-lock.json`, `pnpm-lock.yaml`); use whichever you prefer. pnpm is set to a flat `node_modules` (`.npmrc`, `pnpm-workspace.yaml`) because Metro and React Native libraries expect it. Add packages with `npx expo install --npm <package>` or `pnpm exec expo install --pnpm <package>` and the matching lockfile updates; the other one needs the same change (run `npm install --package-lock-only` or `pnpm install --lockfile-only`). Scripts such as `npm test` work the same with `pnpm test`.

`expo-trim-video` is a native module, so the app needs a **development build**. Expo Go will not work.

The app targets **iOS and Android only** (`platforms` in `app.json`). Web is disabled on purpose: `expo-trim-video` has no web implementation, and `expo-sqlite` on web needs extra wasm and header setup.

Scripts: `npm test`, `npm run typecheck`, `npm run lint`.

## Usage

1. Tap **New video** and choose a video (at least 5 seconds long).
2. Drag the slider to pick where the 5-second segment starts. The preview loops that segment.
3. Tap **Next**, enter a name and description, then tap **Crop & save**.
4. Open a video from the list to see its details. Tap **Edit** to change its name or description.

## Architecture

Feature-based architecture in the style of [Bulletproof React](https://github.com/alan2207/bulletproof-react), borrowing the layer rule, segment names (`ui`, `api`, `model`) and public-API rule from [Feature-Sliced Design](https://feature-sliced.design). Container/Presentational for screens, hooks for logic, one folder per feature.

```
route (container)  ->  controller hook  ->  api (SQLite, TanStack Query) / model (Zod, types, Zustand)
       |
       +--------->  presentational component (props in, JSX out)
```

| Layer           | Where                                                                 | May use                                       |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------- |
| Container       | `src/app/**` (route files, ~10 lines)                                 | a feature's public API (`@/features/<name>`)  |
| Controller hook | `src/features/*/hooks/`                                               | router, `api`, `model`, other hooks           |
| API             | `src/features/*/api/` (`repo.ts` SQLite, `queries.ts` TanStack Query) | `model`, `core`, `shared`                     |
| Model           | `src/features/*/model/` (`schema.ts`, `types.ts`, `store.ts`)         | pure code only; never `api`, UI or the router |
| Presentational  | `src/features/*/ui/`, `src/shared/ui/`, `src/shared/media/ui/`        | props only; no router, store, queries, SQLite |

```
src/
  app/            routes only (containers): /, /videos/[id], /videos/[id]/edit, /crop/*
  features/       domain code, one folder per feature, each with a public API in index.ts
    crop/         the "create a clip" flow; depends on videos, never the reverse
      api/        queries (TanStack Query: filmstrip, trim mutation, clip thumbnail)
      model/      store (Zustand wizard state)
      hooks/      use-select-step, use-trim-step, use-metadata-step, guards
      ui/         select-step, trim-step, metadata-step, scrubber, filmstrip
    videos/
      api/        repo (SQLite), queries (TanStack Query)
      model/      schema (Zod), types
      hooks/      use-video-list, use-video-details, use-edit-video, use-metadata-form, use-route-video
      ui/         video-list, video-list-item, video-details, edit-video, metadata-form
  shared/         domain-agnostic code any feature may use
    ui/           button, error-fallback, loader, notice, screen, screen-header, step-bar
                  (Screen is the only place that applies safe-area padding)
    media/        video and image helpers: ui/ (video-player, clip-thumbnail),
                  hooks/ (use-clip-player), utils/ (thumbnails)
    utils/        files, format-date
  core/           app infrastructure, below everything else
    config.ts     app-wide constants (CLIP_SECONDS)
    db/           connection (index.ts), migrate.ts, migrations.ts (append-only)
    i18n/         setup (index.ts) and locales/ (en.ts, tr.ts)
    query/        the shared QueryClient
    theme/        colors.json (single palette source, also read by tailwind.config.js) and theme
  test/           Jest setup, shared helpers, architecture.test.ts
```

Dependencies point one way: `app` -> `features` -> `shared` -> `core`. `shared` and `core` never import a
feature, and `core` never imports `shared`. A feature's `api/` and `model/` never import ui, hooks or
the router, and `model/` never imports `api/`.

**Public API.** Each feature exposes what others may use from its `index.ts` (named exports only). Routes
and other features import `@/features/videos`, never `@/features/videos/hooks/...`, so a feature's inner
folders can be reorganised without touching callers. A new feature is a new folder with the same layout.

**Schema changes.** Add a new entry to `core/db/migrations.ts`; never edit one that has shipped. `migrate.ts`
runs the entries a database has not seen yet and records progress in `PRAGMA user_version`.

**Colors.** Edit `src/core/theme/colors.json`. Use class names (`bg-brand`, `bg-surface`) where possible and
`theme.colors.*` for props that cannot take a class (Slider tint, navigator background).

Every component is a folder with the same files (the `table/index.tsx` pattern from Expo's
[folder structure guide](https://expo.dev/blog/expo-app-folder-structure-best-practices)):

```
button/
  index.tsx           export function Button(...) { ... }   (import it as '@/shared/ui/button')
  button.styles.ts    export const styles = { container: '...', label: '...' }
```

Class names stay complete literal strings so Tailwind can find them (`tailwind.config.js` scans `src/**/*.{ts,tsx}`). `.vscode/settings.json` points Tailwind IntelliSense at `styles = { ... }` objects. Tests sit next to the code as `name.test.tsx`.

### Naming

| What                 | Convention                                                                                                              | Example                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Files and folders    | kebab-case, as in the Expo template. Exports keep React casing (`VideoList`, `useTrimStep`)                             | `video-list/`, `use-trim-step.ts`, `format-date.ts`                                    |
| Component folder     | `name/` with `index.tsx` (the component) and `name.styles.ts`                                                           | `video-list/index.tsx`, `video-list/video-list.styles.ts`                              |
| Styles file          | `name.styles.ts`, one `styles` object of literal class strings                                                          | `video-list.styles.ts`                                                                 |
| Hook file            | `use-xxx.ts`, exporting `useXxx`                                                                                        | `use-trim-step.ts` -> `useTrimStep`                                                    |
| Route file           | lowercase, `[param]`, `_layout`; collection name is plural, same as the feature                                         | `videos/[id]/edit.tsx`                                                                 |
| Route default export | `<Name>Screen`                                                                                                          | `VideoDetailsScreen`, `TrimStepScreen`                                                 |
| Crop step            | route, hook and component share one name: `/crop/trim` -> `use-trim-step` -> `trim-step`                                | `metadata-step`                                                                        |
| Shared form          | `metadata-form` renders fields only and takes a `header` slot; `metadata-step` and `edit-video` fill it                 |                                                                                        |
| Formatting           | `.prettierrc.json`: single quotes, 110 columns (Tailwind IntelliSense reads single-quoted `styles` objects)             |                                                                                        |
| Feature modules      | lowercase noun, one role each                                                                                           | `api/repo.ts`, `api/queries.ts`, `model/store.ts`, `model/schema.ts`, `model/types.ts` |
| Tests                | next to the code, `*.test.ts(x)`                                                                                        | `schema.test.ts`, `use-trim-step.test.tsx`                                             |
| Imports              | `@/` across folders, `./` inside a folder, feature public API from outside the feature                                  | `@/shared/ui/button`, `@/features/videos`                                              |
| `index.ts(x)`        | a component's `index.tsx` holds the component; a module or feature `index.ts` is a named-export entry, never `export *` |                                                                                        |

`src/test/architecture.test.ts` enforces this: the layer rules above, the component folder layout, kebab-case names for every file and folder, feature public APIs (no deep imports from outside a feature), and `useQuery`/`useMutation` only in `api/queries.ts`.

Trimmed clips are moved into the app's document directory and listed from SQLite. If saving the row fails, the clip file is deleted again.

The 5-second length is fixed, so the scrubber is a single slider for the start point; the end follows automatically (no two-handle range).

## Tooling

- **Builds:** `eas.json` defines `development` (dev client), `preview` and `production` profiles: `bunx eas-cli build --profile development` (or `npx eas-cli@latest build ...`).
- **Commits:** see below; a husky hook enforces them locally.

## i18n

All UI text lives in `src/core/i18n/locales/` (`en.ts`, `tr.ts`) and is read with `t('section.key')` from `react-i18next`. The language follows the device (English if unsupported). `t()` keys are type-checked against `en.ts`, and `tr.ts` is typed as `typeof en`, so a missing key fails `npm run typecheck`. Validation errors from Zod are keys (`validation.*`) translated by the form.

To add a language: create `locales/<code>.ts` typed as `typeof en` and register it in `src/core/i18n/index.ts`.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org). A husky `commit-msg` hook runs commitlint and rejects anything else.

```
feat(crop): add scrubber
fix: keep clip after app restart
docs: update setup steps
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
