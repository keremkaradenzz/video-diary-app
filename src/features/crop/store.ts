import { create } from 'zustand';

type CropState = {
  sourceUri: string | null;
  duration: number;
  startSec: number;
  setSource: (uri: string, duration: number) => void;
  setStart: (s: number) => void;
  reset: () => void;
};

const initial = { sourceUri: null, duration: 0, startSec: 0 };

export const useCropStore = create<CropState>((set) => ({
  ...initial,
  setSource: (sourceUri, duration) => set({ sourceUri, duration, startSec: 0 }),
  setStart: (startSec) => set({ startSec }),
  reset: () => set(initial),
}));
