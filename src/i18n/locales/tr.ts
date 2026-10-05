import type { en } from './en';

// Typed as `typeof en`, so a missing or extra key fails `npm run typecheck`.
export const tr: typeof en = {
  common: {
    notFound: 'Video bulunamadı.',
    close: 'Kapat',
    back: 'Geri',
    play: 'Oynat',
    pause: 'Duraklat',
  },
  home: {
    title: 'Video Günlüğü',
    empty: 'Henüz video yok.',
    emptyHint: 'İlk 5 saniyelik klibini ekle.',
    summary_one: '{{count}} klip · toplam {{seconds}} sn',
    summary_other: '{{count}} klip · toplam {{seconds}} sn',
    newVideo: 'Yeni video',
  },
  details: {
    title: 'Detaylar',
    edit: 'Düzenle',
    meta: '{{date}} · {{seconds}} sn',
  },
  edit: {
    title: 'Düzenle',
    heading: 'Klibi düzenle',
    save: 'Kaydet',
  },
  crop: {
    selectTitle: '1. Video seç',
    trimTitle: '2. Kırp',
    metadataTitle: '3. Detaylar',
    choose: 'Galeriden seç',
    selectHeading: 'Bir video seç',
    selectHint: 'Galerinden bir video seç, sonra ondan bir bölüm kırp.',
    noVideo: 'Henüz video seçilmedi',
    step: 'Adım {{step}} / {{total}}',
    trimHeading: '{{seconds}} saniyeni seç',
    start: 'Başlangıç',
    end: 'Bitiş',
    minus: '− 1 sn',
    plus: '+ 1 sn',
    previewLabel: 'Önizleme · seçili {{seconds}} sn döngüde',
    trimHint: 'Kaydırıcıyı sürükle ya da düğmeleri kullan. Klip her zaman {{seconds}} saniyedir.',
    next: 'İleri',
    metadataHeading: 'Klibe ad ver',
    cropAndSave: 'Kırp ve kaydet',
    range: '{{start}} sn – {{end}} sn / {{total}} sn',
    tooShort: 'Video en az {{seconds}} saniye uzunluğunda olmalı.',
    trimUnavailable: "Kırpma için geliştirme build'i gerekir, Expo Go'da çalışmaz.",
  },
  form: {
    name: 'Ad',
    description: 'Açıklama',
    optional: 'isteğe bağlı',
  },
  validation: {
    nameRequired: 'Ad zorunlu',
    nameMax: 'En fazla 60 karakter',
    descriptionMax: 'En fazla 500 karakter',
  },
};
