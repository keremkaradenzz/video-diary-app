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

## Structure

```
src/
  app/          Expo Router screens (/, /video/[id], /edit/[id], /crop/*)
  components/   VideoPlayer, Scrubber, MetadataForm
  features/
    crop/       Zustand store for the crop flow, trimVideo mutation
    videos/     Zod schema, SQLite repo, TanStack Query hooks
  lib/db.ts     SQLite connection and schema
```

Trimmed clips are copied into the app's document directory and listed from SQLite.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org). A husky `commit-msg` hook runs commitlint and rejects anything else.

```
feat(crop): add scrubber
fix: keep clip after app restart
docs: update setup steps
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
