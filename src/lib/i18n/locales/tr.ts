import type { en } from './en';

// Typed as `typeof en`, so a missing or extra key fails `npm run typecheck`.
export const tr: typeof en = {
  common: {
    notFound: 'Video bulunamadı.',
  },
  home: {
    title: 'Video Günlüğü',
    empty: 'Henüz video yok.',
    newVideo: 'Yeni video',
  },
  details: {
    title: 'Detaylar',
    edit: 'Düzenle',
  },
  edit: {
    title: 'Düzenle',
    save: 'Kaydet',
  },
  crop: {
    selectTitle: '1. Video seç',
    trimTitle: '2. Kırp',
    metadataTitle: '3. Detaylar',
    choose: 'Video seç',
    next: 'İleri',
    cropAndSave: 'Kırp ve kaydet',
    range: '{{start}} sn – {{end}} sn / {{total}} sn',
    tooShort: 'Video en az {{seconds}} saniye uzunluğunda olmalı.',
  },
  form: {
    name: 'Ad',
    description: 'Açıklama',
  },
  validation: {
    nameRequired: 'Ad zorunlu',
    nameMax: 'En fazla 60 karakter',
    descriptionMax: 'En fazla 500 karakter',
  },
};
