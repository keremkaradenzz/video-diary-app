import i18n from './index';

describe('i18n', () => {
  it('is initialised synchronously', () => {
    expect(i18n.isInitialized).toBe(true);
  });

  it('translates to Turkish and English', () => {
    expect(i18n.t('home.title', { lng: 'tr' })).toBe('Video Günlüğü');
    expect(i18n.t('home.title', { lng: 'en' })).toBe('Video Diary');
  });

  it('interpolates values', () => {
    expect(i18n.t('crop.tooShort', { lng: 'tr', seconds: 5 })).toBe(
      'Video en az 5 saniye uzunluğunda olmalı.',
    );
  });

  it('falls back to English for unsupported languages', () => {
    expect(i18n.t('common.notFound', { lng: 'de' })).toBe('Video not found.');
  });
});
