# Video Diary App — Implementation Plan

Stack: Expo (SDK 57), Expo Router, Zustand, TanStack Query, expo-trim-video, NativeWind, expo-video, expo-sqlite, Zod. Commits follow Conventional Commits.

## Step 1 — Project foundation

Expo + TypeScript scaffold, NativeWind, commitlint + husky, folder layout (`src/app`, `src/features`, `src/shared`, `src/core`; see README). Done.

## Step 2 — Data layer

SQLite `videos` table, repo (list/get/insert/update), TanStack Query hooks, Zod metadata schema, Zustand crop store, `useTrimVideo` mutation. Scaffolded; needs unit tests for schema and repo mapping.

## Step 3 — Crop modal: video selection

Implement `/crop` screen: pick a video with expo-image-picker, read duration, store in `useCropStore`, navigate to `/crop/trim`. Reject videos shorter than 5 seconds.

## Step 4 — Crop modal: scrubber

Implement `/crop/trim`: reusable `VideoPlayer` (expo-video) plus `Scrubber` that selects the start of a fixed 5-second window; preview loops the window; "Next" button below the scrubber goes to `/crop/metadata`.

## Step 5 — Crop modal: metadata and crop execution

Implement `/crop/metadata`: reusable `MetadataForm` (name input, description textarea) validated with Zod; submit runs `useTrimVideo` (TanStack Query mutation around `trimVideo`), then `useSaveVideo`, resets the crop store and returns to the list. Show loading and error states.

## Step 6 — Main screen: video list

Implement `/` with a virtualized list (FlashList) of saved videos from SQLite via `useVideos`, empty state, "New video" button opening `/crop`, tap navigates to `/video/[id]`.

## Step 7 — Details page

Implement `/video/[id]`: `VideoPlayer` with the cropped clip, name and description, minimal UI, link to edit.

## Step 8 — Edit page

Implement `/edit/[id]`: reuse `MetadataForm`, persist with `useUpdateMetadata`, invalidate queries.

## Step 9 — Animations, tests and documentation

Add React Native Reanimated list/entry animations, tests for schema/store/repo, README with setup (dev build required for expo-trim-video), usage and Conventional Commits guide.
