# Video Diary App — Implementation Plan

Stack: Expo (SDK 57), Expo Router, Zustand, TanStack Query, expo-trim-video, NativeWind, expo-video, expo-sqlite, Reanimated, Zod. Commits follow Conventional Commits. The architecture is described in the README. Every step below is implemented.

## Step 1 — Project foundation

Expo + TypeScript, NativeWind, ESLint + Prettier, commitlint + husky, the folder layout from Expo's guide (`src/app`, `src/screens`, `src/components`, `src/hooks`, `src/utils`, plus `src/db`, `src/query`, `src/i18n`, `src/constants`, `src/themes` and `src/types`; each screen folder holds `index.tsx`, `components/` and `hooks/`) with an architecture test that enforces it.

## Step 2 — Data layer

SQLite `videos` table with versioned migrations (`db`), `db/videos.ts` (paged list, count, get, insert, update), TanStack Query hooks in `hooks/` (`use-videos`, `use-video`, `use-save-video`, ...) with keys in `query/keys.ts`, Zod metadata schema in `utils/video-schema.ts`, Zustand crop store in `hooks/use-crop-store.ts`, `useTrimVideo` mutation in `screens/metadata-step/hooks`.

## Step 3 — Crop modal: video selection

`/crop`: pick a video with expo-image-picker, read its duration, store it in `useCropStore`, go to `/crop/trim`. Videos shorter than 5 seconds are rejected.

## Step 4 — Crop modal: scrubber

`/crop/trim`: reusable `VideoPlayer` (expo-video) plus `Scrubber`, a draggable fixed 5-second window over a filmstrip of the source (the end follows; haptic feedback, ±1 s buttons), the preview loops the window, and a "Next" button below the scrubber goes to `/crop/metadata`.

## Step 5 — Crop modal: metadata and crop execution

`/crop/metadata`: reusable `MetadataForm` (name input, description textarea) validated with Zod. Submit runs `useTrimVideo` (a TanStack Query mutation around `trimVideo`), then `useSaveVideo`, resets the crop store and returns to the list. Before saving, the preview frame is written to the list's thumbnail cache, so the new row shows it without decoding the clip. Loading and error states are shown; if saving fails, the trimmed file is deleted.

## Step 6 — Main screen: video list

`/`: FlashList of saved clips read page by page from SQLite (`useVideos`, infinite query), thumbnails for visible rows only, empty state, "New video" button opening `/crop`, tap opens `/videos/[id]`.

## Step 7 — Details page

`/videos/[id]`: `VideoPlayer` with the cropped clip, name, description and a link to edit. Minimal UI.

## Step 8 — Edit page

`/videos/[id]/edit`: reuses `MetadataForm`, persists with `useUpdateMetadata`, patches the cached list and detail in place.

## Step 9 — Animations, tests and documentation

Reanimated entry animations for list rows and form errors. Tests for schema, store, repo, migrations, query hooks, controller hooks and the architecture rules. README with setup (a development build is required for expo-trim-video), usage, architecture and the Conventional Commits guide.
