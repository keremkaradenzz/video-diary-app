# Video Diary

Import a video, crop a 5-second segment, add a name and description, and keep it in a list.

## Stack

Expo (SDK 57) · Expo Router · Zustand · TanStack Query · expo-trim-video · NativeWind · expo-video · expo-sqlite · Reanimated · Zod · FlashList · i18next · expo-haptics

## Setup

Requirements: Node 20+, Xcode for iOS and/or Android Studio for Android.

```bash
# npm
npm install
npx expo run:ios      # or: npx expo run:android

# pnpm
pnpm install
pnpm exec expo run:ios      # or: pnpm exec expo run:android
```

`package-lock.json` is the committed lockfile (EAS Build and `expo-doctor` expect a single one). pnpm works too: `pnpm install` creates its own `pnpm-lock.yaml`, which is git-ignored. pnpm is set to a flat `node_modules` (`.npmrc`, `pnpm-workspace.yaml`) because Metro and React Native libraries expect it, and `packageManager` in `package.json` pins pnpm 10 so it runs on Node 20. Add packages with `npx expo install <package>` (or `pnpm exec expo install --pnpm <package>`); scripts such as `npm test` work the same with `pnpm test`.

`expo-trim-video` is a native module, so the app needs a **development build**. Expo Go will not work.

The app targets **iOS and Android only** (`platforms` in `app.json`). Web is disabled on purpose: `expo-trim-video` has no web implementation, and `expo-sqlite` on web needs extra wasm and header setup.

Scripts: `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run verify` (typecheck, lint and tests in one go).

## Usage

1. Tap **New video** and choose a video (at least 5 seconds long).
2. Drag the frame along the filmstrip, tap the strip to jump there, or use the ±1 s buttons, to pick where the 5-second segment starts. The preview loops that segment.
3. Tap **Next**, enter a name and description, then tap **Crop & save**.
4. Open a video from the list to see its details. Tap **Edit** to change its name or description.

## Features

| Feature                                                     | Where                                                                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| List of saved clips, persisted, tap opens the details       | `/` (`screens/home`), SQLite via `db/videos.ts`, row tap goes to `/videos/[id]`                                            |
| Details: video, name, description                           | `/videos/[id]` (`screens/video-details`)                                                                                   |
| Pick a video from the device                                | `/crop` (`screens/select-step`, `expo-image-picker`)                                                                       |
| Choose the 5 s segment with a scrubber, then continue       | `/crop/trim` (`screens/trim-step`: `video-player`, `filmstrip`, `scrubber`, **Next**)                                      |
| Name and description form, then crop and save               | `/crop/metadata` (`screens/metadata-step`, `components/metadata-form`, **Crop & save**)                                    |
| Cropping with `expo-trim-video`, run through TanStack Query | `useTrimVideo`, a `useMutation` in `screens/metadata-step/hooks/use-trim-video.ts`                                         |
| Edit name and description                                   | `/videos/[id]/edit` (`screens/edit-video`, reuses `components/metadata-form`)                                              |
| Validation with Zod                                         | one schema for the create and edit forms, inline error messages                                                            |
| Animations with Reanimated                                  | list row entry and error messages                                                                                          |
| Delete a clip                                               | `/videos/[id]` (`screens/video-details/hooks/use-confirm-delete.ts`, confirmation first): row removed, then the file       |
| Reusable components                                         | `components/`: `video-player` (trim step, details), `metadata-form` (create, edit), `clip-thumbnail`, `step-bar`, `button` |
| Growing lists stay fast                                     | keyset-paged infinite query (no skipped or doubled rows), lazy thumbnails, FlashList                                       |
| English and Turkish UI                                      | `src/i18n/locales/`, the language follows the device, keys are type-checked                                                |
| Simple navigation and styling                               | 3-step modal with a step bar, safe areas, loading and error states; NativeWind classes throughout                          |

## Design decisions

- **Persistence:** clips live in SQLite (`expo-sqlite`) rather than Zustand + AsyncStorage. It gives an indexed, paged, newest-first query that keeps a growing list cheap. The schema is versioned with append-only migrations.
- **Zustand** holds only the transient crop wizard state (picked video, its duration, start second) and is reset when the modal closes. It is not persisted.
- **TanStack Query** runs the asynchronous work: `trimVideo` is a mutation, list/detail reads are queries (the list is an infinite query), and thumbnails are queries cached on disk.
- **Scrubber:** the clip length is fixed at 5 seconds, so one draggable window over the filmstrip picks the start and the end is derived. It is a single pan gesture (touching outside the window moves it there) with haptic ticks, plus ±1 s buttons and screen-reader increment/decrement actions. A two-handle range would only allow lengths the app rejects.
- **Validation:** one Zod schema validates both the create and the edit form; its messages are i18n keys.
- **Clip files** are stored by file name and resolved against the document directory when read, because the app container path changes between installs and updates on iOS. If saving a clip fails after trimming, the trimmed file is deleted.
- **Errors:** a render error in any route shows a translated fallback with a retry button (`ErrorBoundary` in `app/_layout.tsx`); failures of the trim, the database or the list show up as messages in the screen that triggered them.
- **Scale:** paged queries, thumbnails only for visible rows, a virtualized list (FlashList), and a folder layout whose import directions are enforced by a test.

## Architecture

The folder layout starts from Expo's guide, [How to organize Expo app folder structure](https://expo.dev/blog/expo-app-folder-structure-best-practices): a `src/` folder, routes in `src/app` that only render a screen, a `components/` folder for reusable UI, a `screens/` folder for the UI of each route, and `hooks/` and `utils/`. It goes one step further for a project of this size: **a screen folder has the same shape as `src/` itself** (`components/` and `hooks/`), so every piece of code has one obvious place, and `src/` holds only folders (no loose files).

```
src/
  app/                  routes only: each file renders one screen (URL params are read here)
    _layout.tsx           root stack, QueryClientProvider, splash screen, ErrorBoundary
    index.tsx             /                  -> <Home />
    videos/[id]/index.tsx /videos/[id]       -> <VideoDetails id />
    videos/[id]/edit.tsx  /videos/[id]/edit  -> <EditVideo id />
    crop/                 _layout, index (SelectStep), trim (TrimStep), metadata (MetadataStep)
  screens/              what each route shows; one folder per screen, always the same three entries
    home/                 index.tsx, components/ (video-list, video-list-item), hooks/ (use-video-list)
    video-details/        index.tsx, hooks/ (use-video-details, use-confirm-delete)
    edit-video/           index.tsx, hooks/ (use-edit-video)
    select-step/          index.tsx, hooks/ (use-select-step)
    trim-step/            index.tsx, components/ (filmstrip, scrubber), hooks/ (use-trim-step, use-filmstrip)
    metadata-step/        index.tsx, hooks/ (use-metadata-step, use-trim-video, use-clip-thumbnail)
  components/           reusable UI, props in and JSX out: button, screen, screen-header, step-bar,
                        loader, notice, error-fallback, video-player, clip-thumbnail, metadata-form
  hooks/                building blocks, not tied to one screen: data access (use-videos, use-video,
                        use-video-count, use-thumbnails, use-save-video, use-update-metadata,
                        use-delete-video) and shared behaviour (use-metadata-form, use-crop-store,
                        use-clip-player, use-require-source, use-reset-crop-on-exit)
  db/                   SQLite: index.ts (connection), migrate.ts, migrations.ts, videos.ts (queries)
  query/                TanStack Query setup: client.ts, keys.ts
  i18n/                 index.ts, locales/ (en.ts, tr.ts)
  utils/                small helpers: files, format-date, thumbnails, video-schema (Zod)
  constants/            config.ts (CLIP_SECONDS)
  themes/               theme.ts, colors.json (also read by tailwind.config.js), global.css (Tailwind entry)
  types/                video.ts (Video, MetadataFormFields)
  test/                 Jest setup, query-wrapper (test helper), architecture.test.ts
```

A component is a single file named after it (`components/button.tsx`). It would become a folder with an
`index.tsx` only if it grew parts of its own. Styles are an object at the bottom of the component file, and
tests sit next to the code (`name.test.ts(x)`). Imports use the template's single alias, `@/`
(`@/components/button`, `@/db/videos`), configured in `tsconfig.json` and mirrored in `jest.config.js`.

**Routes vs screens.** `app/` and `screens/` are two halves of every page. Expo Router turns every file in
`app/` into a route, so nothing but route files can live there. A route file only maps an address to a screen
(and reads URL params); the screen holds the UI and the logic.

```tsx
// src/app/videos/[id]/index.tsx: the route, 6 lines
export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <VideoDetails id={Number(id)} />;
}
```

| Route (`app/`)      | Screen (`screens/`) | What it does                          |
| ------------------- | ------------------- | ------------------------------------- |
| `/`                 | `home`              | clip list and the "New video" button  |
| `/videos/[id]`      | `video-details`     | plays a clip; edit and delete         |
| `/videos/[id]/edit` | `edit-video`        | edits name and description            |
| `/crop`             | `select-step`       | step 1: pick a video from the library |
| `/crop/trim`        | `trim-step`         | step 2: choose the 5 second window    |
| `/crop/metadata`    | `metadata-step`     | step 3: name it, crop and save        |

The `_layout.tsx` files (navigation structure, error fallback, splash screen) stay in `app/` because they frame
routes rather than show a screen.

**Where does code go?**

| Code                                                             | Place                       |
| ---------------------------------------------------------------- | --------------------------- |
| A screen's own UI parts                                          | that screen's `components/` |
| A screen's own flow: navigation, steps, local state              | that screen's `hooks/`      |
| UI used by several screens                                       | `components/`               |
| Data access (queries, mutations) and behaviour shared by screens | `hooks/`                    |
| SQL and migrations                                               | `db/`                       |
| Pure helpers, validation, file helpers                           | `utils/`                    |
| Palette, theme object, Tailwind CSS entry                        | `themes/`                   |

**Screen hooks vs `hooks/`.** A hook in `screens/<name>/hooks/` is that screen's controller: it answers "what
happens on this screen" (`use-trim-step` pushes the next route and holds the dragged window position;
`use-confirm-delete` asks, deletes and goes back). A hook in `hooks/` is a building block that answers "how is this
done" (`use-delete-video` removes a row and its file, `use-clip-player` creates a looping player). Screen hooks call
the building blocks, never the other way round, and a screen never imports another screen's hooks. Data access sits
in `hooks/` even when only one screen uses it today, so there is a single place to look for how the app reads and
writes videos.

**Import direction** (`src/test/architecture.test.ts`):

```
app  ->  screens  ->  components / hooks  ->  db, query, utils, themes  ->  constants, types
```

Routes render a screen and read URL params, nothing else. A screen reaches its own parts with relative paths and
never imports another screen or `db/` directly. Components never touch the router, stores, hooks, queries or
SQLite, so they stay reusable. `useQuery` and `useMutation` live in `use-xxx` hook files.

**Schema changes.** Add a new entry to `db/migrations.ts`; never edit one that has shipped. `migrate.ts` runs the
entries a database has not seen yet and records progress in `PRAGMA user_version`.

**Colors.** Edit `src/themes/colors.json`. Use class names (`bg-brand`, `bg-surface`) where possible and
`theme.colors.*` for props that cannot take a class (navigator background). Class names stay complete
literal strings so Tailwind can find them (`tailwind.config.js` scans `src/**/*.{ts,tsx}`), and
`.vscode/settings.json` points Tailwind IntelliSense at the `styles = { ... }` objects.

**Not used from the guide:** `server/` and `+api` routes (the app has no backend) and platform-specific file
extensions (`.web`, `.ios`; the app is native-only because `expo-trim-video` is).

### Naming

| What              | Convention                                                                                    | Example                                                |
| ----------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Files and folders | kebab-case, as in the Expo template. Exports keep React casing (`VideoList`, `useTrimStep`)   | `video-list.tsx`, `use-trim-step.ts`, `format-date.ts` |
| Component file    | `name.tsx` exporting `Name`                                                                   | `components/step-bar.tsx` -> `StepBar`                 |
| Screen            | `screens/name/index.tsx` exporting `Name`, with `components/` and `hooks/` beside it          | `screens/trim-step/index.tsx` -> `TrimStep`            |
| Hook file         | `use-xxx.ts`, exporting `useXxx`                                                              | `use-trim-step.ts` -> `useTrimStep`                    |
| Route file        | lowercase, `[param]`, `_layout`; default export `<Name>Screen`                                | `videos/[id]/edit.tsx` -> `EditVideoScreen`            |
| Crop step         | route, hook and screen share one name: `/crop/trim` -> `use-trim-step` -> `screens/trim-step` | `metadata-step`                                        |
| Shared form       | `components/metadata-form` renders fields only and takes a `header` slot; two screens fill it | `metadata-step`, `edit-video`                          |
| Formatting        | `.prettierrc.json`: single quotes, 110 columns                                                |                                                        |
| Tests             | next to the code, `*.test.ts(x)`; never in `__tests__`                                        | `video-schema.test.ts`, `use-trim-step.test.tsx`       |
| Imports           | `@/` across folders, `./components/...` and `./hooks/...` inside a screen                     | `@/hooks/use-videos`, `./hooks/use-trim-step`          |
| `index.ts(x)`     | only a screen's `index.tsx`, `db/index.ts` and `i18n/index.ts`; no barrels, never `export *`  |                                                        |

`src/test/architecture.test.ts` enforces this: the folder list (and that `src/` has no loose files), what a screen
folder may contain, import directions, route files that only render a screen, presentational components, one named
export per component and screen, kebab-case names for every file and folder, no `*.styles` files, and
`useQuery`/`useMutation` only in hook files.

## Testing

`npm test` runs the unit tests (Zod schema, SQLite queries and migrations, the screen hooks for the crop flow, edit and delete, file and date helpers, locale completeness) and the architecture rules in `src/test/architecture.test.ts`. `npm run verify` runs typecheck, lint and tests together, which is what a change has to pass.

## Tooling

- **Builds:** `eas.json` defines `development` (dev client), `preview` and `production` profiles: `npx eas-cli@latest build --profile development --platform android` (an installable APK for the `preview` profile).
- **Commits:** see below; a husky hook enforces them locally.
- **Formatting:** Prettier (with the Tailwind class sorter) via `npm run format`; `lint-staged` formats and lints staged files on commit.

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
