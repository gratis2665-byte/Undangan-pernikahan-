'use client';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  photoUrl?: string;
  quote: string;
}

export interface WeddingData {
  guestName: string;
  groom: {
    name: string;
    fullName: string;
    title: string;
    parents: string;
    instagram: string;
    photoUrl?: string;
  };
  bride: {
    name: string;
    fullName: string;
    title: string;
    parents: string;
    instagram: string;
    photoUrl?: string;
  };
  eventDateDisplay: string;
  akad: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapsUrl: string;
  };
  resepsi: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapsUrl: string;
  };
  verse: {
    surah: string;
    arabic: string;
    translation: string;
  };
  bankAccounts: {
    bank1: { name: string; number: string; holder: string };
    bank2: { name: string; number: string; holder: string };
    giftAddress: string;
  };
  gallery: GalleryItem[];
}

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Momen Bahagia di Senja Hari',
    category: 'Prewedding',
    quote: 'Setiap detik bersamamu adalah berkah terindah yang pernah Allah anugerahkan.',
  },
  {
    id: 'g-2',
    title: 'Tatapan Penuh Ketulusan',
    category: 'Portret',
    quote: 'Di matamu, aku menemukan rumah tempat hatiku bernaung selamanya.',
  },
  {
    id: 'g-3',
    title: 'Langkah Menuju Masa Depan',
    category: 'Kenangan',
    quote: 'Bersama mengarungi hari kemarin, menyambut hari esok penuh sukacita.',
  },
  {
    id: 'g-4',
    title: 'Janji di Pelataran Masjid',
    category: 'Istimewa',
    quote: 'Di bawah naungan kubah masjid agung, cinta kami bertumbuh dalam keimanan.',
  },
  {
    id: 'g-5',
    title: 'Senyuman Penuh Kasih',
    category: 'Portret',
    quote: 'Kasih yang tulus karena Allah melenyapkan segala keraguan.',
  },
  {
    id: 'g-6',
    title: 'Cincin Lambang Kesetiaan',
    category: 'Detail',
    quote: 'Sebuah ikatan suci mitsaqan ghalidza dalam ridho Ilahi.',
  },
];

export const DEFAULT_WEDDING_DATA: WeddingData = {
  guestName: 'Bpk. Budi Santoso & Keluarga',
  groom: {
    name: 'Satria',
    fullName: 'Satria Pratama, S.T.',
    title: 'Mempelai Pria',
    parents: 'Putra Pertama dari Bpk. Ir. Hendra Pratama & Ibu Maria Wijaya',
    instagram: '@satria.pratama',
    photoUrl: '',
  },
  bride: {
    name: 'Nadia',
    fullName: 'Nadia Angela, S.Ds.',
    title: 'Mempelai Wanita',
    parents: 'Putri Kedua dari Bpk. Robert Angela & Ibu Elisabeth Susanto',
    instagram: '@nadia.angela',
    photoUrl: '',
  },
  eventDateDisplay: '24 . 10 . 2026',
  akad: {
    title: 'Akad Nikah',
    date: 'Sabtu, 24 Oktober 2026',
    time: 'Pukul 08.00 - 10.00 WIB',
    venue: 'Masjid Agung Sunda Kelapa',
    address: 'Jl. Taman Sunda Kelapa No. 16, Menteng, Jakarta Pusat, DKI Jakarta 10310',
    mapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Sunda+Kelapa+Jakarta',
  },
  resepsi: {
    title: 'Resepsi Pernikahan',
    date: 'Sabtu, 24 Oktober 2026',
    time: 'Pukul 11.30 - 14.30 WIB',
    venue: 'Grand Ballroom Hotel Mulia',
    address: 'Jl. Asia Afrika Senayan, Gelora, Tanah Abang, Jakarta Pusat 10270',
    mapsUrl: 'https://maps.google.com/?q=Hotel+Mulia+Senayan+Jakarta',
  },
  verse: {
    surah: 'QS. Ar-Rum : 21',
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
    translation: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
  },
  bankAccounts: {
    bank1: {
      name: 'BANK BCA',
      number: '8270918234',
      holder: 'Satria Pratama',
    },
    bank2: {
      name: 'BANK MANDIRI',
      number: '1370029188210',
      holder: 'Nadia Angela',
    },
    giftAddress: 'Jl. Senayan Indah No. 42, Kebayoran Baru, Jakarta Selatan 12190 (Penerima: Satria & Nadia)',
  },
  gallery: DEFAULT_GALLERY,
};
