// expo-video needs its native module at import time, which Jest does not have.
jest.mock('@/utils/thumbnails', () => ({ generateThumbnails: jest.fn(async () => []) }));
