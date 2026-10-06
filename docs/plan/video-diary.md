# Video Diary App — Implementation Plan

Stack: Expo (SDK 57), Expo Router, Zustand, TanStack Query, expo-trim-video, NativeWind, expo-video, expo-sqlite, Reanimated, Zod. Commits follow Conventional Commits. The architecture is described in the README. Every step below is implemented.

## Step 1 — Project foundation

Expo + TypeScript, NativeWind, ESLint + Prettier, commitlint + husky, feature-based folder layout (`src/app`, `src/features`, `src/shared`, `src/core`) with an architecture test that enforces it.

## Step 2 — Data layer

SQLite `videos` table with versioned migrations (`core/db`), `videos/api/repo.ts` (paged list, count, get, insert, update), TanStack Query hooks in `api/queries.ts`, Zod metadata schema in `videos/model`, Zustand crop store in `crop/model`, `useTrimVideo` mutation in `crop/api`.

## Step 3 — Crop modal: video selection

`/crop`: pick a video with expo-image-picker, read its duration, store it in `useCropStore`, go to `/crop/trim`. Videos shorter than 5 seconds are rejected.

## Step 4 — Crop modal: scrubber

`/crop/trim`: reusable `VideoPlayer` (expo-video) plus `Scrubber`, a slider for the start of the fixed 5-second window (the end follows). A filmstrip shows frames of the source, the preview loops the window, and a "Next" button below the scrubber goes to `/crop/metadata`.

## Step 5 — Crop modal: metadata and crop execution

`/crop/metadata`: reusable `MetadataForm` (name input, description textarea) validated with Zod. Submit runs `useTrimVideo` (a TanStack Query mutation around `trimVideo`), then `useSaveVideo`, resets the crop store and returns to the list. Loading and error states are shown; if saving fails, the trimmed file is deleted.

## Step 6 — Main screen: video list

`/`: FlashList of saved clips read page by page from SQLite (`useVideos`, infinite query), thumbnails for visible rows only, empty state, "New video" button opening `/crop`, tap opens `/videos/[id]`.

## Step 7 — Details page

`/videos/[id]`: `VideoPlayer` with the cropped clip, name, description and a link to edit. Minimal UI.

## Step 8 — Edit page

`/videos/[id]/edit`: reuses `MetadataForm`, persists with `useUpdateMetadata`, patches the cached list and detail in place.

## Step 9 — Animations, tests and documentation

Reanimated entry animations for list rows and form errors. Tests for schema, store, repo, migrations, query hooks, controller hooks and the architecture rules. README with setup (a development build is required for expo-trim-video), usage, architecture and the Conventional Commits guide.
