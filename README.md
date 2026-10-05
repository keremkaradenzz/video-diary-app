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
| Data hooks | `src/features/videos/queries.ts`, `crop/store.ts` | repo, TanStack Query, Zustand |
| Presentational | `src/components/**`, `src/features/*/components/` | props only; no router, store, queries, SQLite |

```
src/
  app/          containers: /, /video/[id], /edit/[id], /crop/*
  components/   shared UI: Button, Feedback, VideoPlayer
  features/
    crop/       components (SelectVideo, TrimEditor, Scrubber), hooks (one per step), store
    videos/     components (VideoList, VideoDetails, MetadataForm), hooks, schema, repo, queries
  lib/          db.ts (SQLite connection and schema), i18n/ (setup and locales)
```

`src/architecture.test.ts` fails if a presentational component imports the router, store, queries, SQLite or a hook, or if a container reaches into the data layer directly.

Trimmed clips are copied into the app's document directory and listed from SQLite.

## i18n

All UI text lives in `src/lib/i18n/locales/` (`en.ts`, `tr.ts`) and is read with `t('section.key')` from `react-i18next`. The language follows the device (English if unsupported). `t()` keys are type-checked against `en.ts`, and `tr.ts` is typed as `typeof en`, so a missing key fails `npm run typecheck`. Validation errors from Zod are keys (`validation.*`) translated by the form.

To add a language: create `locales/<code>.ts` typed as `typeof en` and register it in `src/lib/i18n/index.ts`.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org). A husky `commit-msg` hook runs commitlint and rejects anything else.

```
feat(crop): add scrubber
fix: keep clip after app restart
docs: update setup steps
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
