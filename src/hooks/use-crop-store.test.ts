import { useCropStore } from './use-crop-store';

describe('useCropStore', () => {
  beforeEach(() => useCropStore.getState().reset());

  it('setSource stores uri and duration and resets start', () => {
    useCropStore.getState().setStart(3);
    useCropStore.getState().setSource('file:///a.mp4', 20);
    expect(useCropStore.getState()).toMatchObject({ sourceUri: 'file:///a.mp4', duration: 20, startSec: 0 });
  });

  it('reset restores the initial state', () => {
    useCropStore.getState().setSource('file:///a.mp4', 20);
    useCropStore.getState().reset();
    expect(useCropStore.getState()).toMatchObject({ sourceUri: null, duration: 0, startSec: 0 });
  });
});
