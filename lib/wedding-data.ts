export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  photoUrl?: string;
  quote: string;
}

export interface StoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
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
  weddingDateIso?: string; // ISO date-time string e.g. "2026-10-24T08:00"
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
    qrisUrl?: string;
  };
  gallery: GalleryItem[];
  stories?: StoryItem[];
}

export const DEFAULT_STORIES: StoryItem[] = [
  {
    id: 's-1',
    year: '2020',
    title: 'Awal Pertemuan',
    description: 'Pertama kali kami dipertemukan dalam sebuah seminar kolaborasi arsitektur dan desain di Jakarta. Percakapan singkat yang bermula dari secangkir kopi berlanjut menjadi ikatan yang tak pernah kami duga.',
  },
  {
    id: 's-2',
    year: '2022',
    title: 'Menjalin Kasih',
    description: 'Setelah dua tahun saling mengenal dan bertumbuh dalam iman, kami memutuskan untuk melangkah bersama dengan komitmen saling melengkapi dan mendukung cita-cita masing-masing.',
  },
  {
    id: 's-3',
    year: '2025',
    title: 'Lamaran Romantis',
    description: 'Di bawah hangatnya senja dan disaksikan oleh kedua keluarga besar, Satria melamar Nadia dengan penuh ketulusan. Sebuah jawaban "Yes" yang memulai babak baru perjalanan kami.',
  },
  {
    id: 's-4',
    year: '2026',
    title: 'Menuju Ikrar Suci',
    description: 'Hari yang dinanti telah tiba. Kami bersiap mengikat janji suci dalam ikrar akad nikah, mengawali kehidupan rumah tangga dalam ridho dan berkah Ilahi.',
  },
];

/**
 * Robustly parses wedding date and time into timestamp for countdown timer
 */
export function parseWeddingTimestamp(data: WeddingData): number {
  if (data.weddingDateIso) {
    const parsed = new Date(data.weddingDateIso).getTime();
    if (!isNaN(parsed)) return parsed;
  }

  const dateStr = data.akad?.date || data.eventDateDisplay || '';
  const monthMap: Record<string, number> = {
    januari: 0, jan: 0,
    februari: 1, feb: 1,
    maret: 2, mar: 2,
    april: 3, apr: 3,
    mei: 4, may: 4,
    juni: 5, jun: 5,
    juli: 6, jul: 6,
    agustus: 7, agu: 7, agt: 7, aug: 7,
    september: 8, sep: 8,
    oktober: 9, okt: 9, oct: 9,
    november: 10, nov: 10,
    desember: 11, des: 11, dec: 11,
  };

  const indonesianMatch = dateStr.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (indonesianMatch) {
    const day = parseInt(indonesianMatch[1], 10);
    const monthKey = indonesianMatch[2].toLowerCase();
    const year = parseInt(indonesianMatch[3], 10);
    if (monthMap[monthKey] !== undefined) {
      let hours = 8;
      let minutes = 0;
      const timeMatch = (data.akad?.time || '').match(/(\d{1,2})[:.](\d{2})/);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
      }
      const d = new Date(year, monthMap[monthKey], day, hours, minutes);
      if (!isNaN(d.getTime())) return d.getTime();
    }
  }

  const numMatch = (data.eventDateDisplay || '').match(/(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})/);
  if (numMatch) {
    const day = parseInt(numMatch[1], 10);
    const month = parseInt(numMatch[2], 10) - 1;
    const year = parseInt(numMatch[3], 10);
    const d = new Date(year, month, day, 8, 0);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  const direct = Date.parse(dateStr);
  if (!isNaN(direct)) return direct;

  return new Date('2026-10-24T08:00:00+07:00').getTime();
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
  weddingDateIso: '2026-10-24T08:00',
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
    qrisUrl: '',
  },
  gallery: DEFAULT_GALLERY,
  stories: DEFAULT_STORIES,
};
