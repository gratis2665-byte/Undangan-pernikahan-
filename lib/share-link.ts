import { WeddingData, DEFAULT_WEDDING_DATA } from './wedding-data';

/**
 * Encodes WeddingData into a safe URL-friendly base64 string
 * Omits huge base64 photo strings to keep URL concise while preserving all wedding details
 */
export function encodeWeddingDataPayload(data: WeddingData): string {
  try {
    const compactPayload = {
      gn: data.guestName,
      gm: {
        n: data.groom.name,
        fn: data.groom.fullName,
        t: data.groom.title,
        p: data.groom.parents,
        ig: data.groom.instagram,
        ph: data.groom.photoUrl && data.groom.photoUrl.length < 800 ? data.groom.photoUrl : undefined,
      },
      br: {
        n: data.bride.name,
        fn: data.bride.fullName,
        t: data.bride.title,
        p: data.bride.parents,
        ig: data.bride.instagram,
        ph: data.bride.photoUrl && data.bride.photoUrl.length < 800 ? data.bride.photoUrl : undefined,
      },
      ed: data.eventDateDisplay,
      wi: data.weddingDateIso,
      ak: {
        t: data.akad.title,
        d: data.akad.date,
        tm: data.akad.time,
        v: data.akad.venue,
        a: data.akad.address,
        m: data.akad.mapsUrl,
      },
      rs: {
        t: data.resepsi.title,
        d: data.resepsi.date,
        tm: data.resepsi.time,
        v: data.resepsi.venue,
        a: data.resepsi.address,
        m: data.resepsi.mapsUrl,
      },
      vr: {
        s: data.verse.surah,
        a: data.verse.arabic,
        t: data.verse.translation,
      },
      bk: {
        b1: data.bankAccounts.bank1,
        b2: data.bankAccounts.bank2,
        ga: data.bankAccounts.giftAddress,
        qr: data.bankAccounts.qrisUrl && data.bankAccounts.qrisUrl.length < 800 ? data.bankAccounts.qrisUrl : undefined,
      },
      st: (data.stories || []).map((s) => ({
        id: s.id,
        y: s.year,
        t: s.title,
        d: s.description,
      })),
    };

    const json = JSON.stringify(compactPayload);
    if (typeof window !== 'undefined') {
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } else {
      return Buffer.from(json).toString('base64url');
    }
  } catch (err) {
    console.error('Failed to encode wedding data payload:', err);
    return '';
  }
}

/**
 * Decodes URL base64 payload into partial WeddingData
 */
export function decodeWeddingDataPayload(raw: string): Partial<WeddingData> | null {
  if (!raw || typeof raw !== 'string') return null;

  try {
    let base64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    let jsonStr = '';
    if (typeof window !== 'undefined') {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonStr = new TextDecoder().decode(bytes);
    } else {
      jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
    }

    const p = JSON.parse(jsonStr);
    if (!p) return null;

    const partial: Partial<WeddingData> = {};

    if (p.gn) partial.guestName = p.gn;
    if (p.ed) partial.eventDateDisplay = p.ed;
    if (p.wi) partial.weddingDateIso = p.wi;

    if (p.gm) {
      partial.groom = {
        name: p.gm.n || DEFAULT_WEDDING_DATA.groom.name,
        fullName: p.gm.fn || DEFAULT_WEDDING_DATA.groom.fullName,
        title: p.gm.t || DEFAULT_WEDDING_DATA.groom.title,
        parents: p.gm.p || DEFAULT_WEDDING_DATA.groom.parents,
        instagram: p.gm.ig || DEFAULT_WEDDING_DATA.groom.instagram,
        photoUrl: p.gm.ph || undefined,
      };
    }

    if (p.br) {
      partial.bride = {
        name: p.br.n || DEFAULT_WEDDING_DATA.bride.name,
        fullName: p.br.fn || DEFAULT_WEDDING_DATA.bride.fullName,
        title: p.br.t || DEFAULT_WEDDING_DATA.bride.title,
        parents: p.br.p || DEFAULT_WEDDING_DATA.bride.parents,
        instagram: p.br.ig || DEFAULT_WEDDING_DATA.bride.instagram,
        photoUrl: p.br.ph || undefined,
      };
    }

    if (p.ak) {
      partial.akad = {
        title: p.ak.t || DEFAULT_WEDDING_DATA.akad.title,
        date: p.ak.d || DEFAULT_WEDDING_DATA.akad.date,
        time: p.ak.tm || DEFAULT_WEDDING_DATA.akad.time,
        venue: p.ak.v || DEFAULT_WEDDING_DATA.akad.venue,
        address: p.ak.a || DEFAULT_WEDDING_DATA.akad.address,
        mapsUrl: p.ak.m || DEFAULT_WEDDING_DATA.akad.mapsUrl,
      };
    }

    if (p.rs) {
      partial.resepsi = {
        title: p.rs.t || DEFAULT_WEDDING_DATA.resepsi.title,
        date: p.rs.d || DEFAULT_WEDDING_DATA.resepsi.date,
        time: p.rs.tm || DEFAULT_WEDDING_DATA.resepsi.time,
        venue: p.rs.v || DEFAULT_WEDDING_DATA.resepsi.venue,
        address: p.rs.a || DEFAULT_WEDDING_DATA.resepsi.address,
        mapsUrl: p.rs.m || DEFAULT_WEDDING_DATA.resepsi.mapsUrl,
      };
    }

    if (p.vr) {
      partial.verse = {
        surah: p.vr.s || DEFAULT_WEDDING_DATA.verse.surah,
        arabic: p.vr.a || DEFAULT_WEDDING_DATA.verse.arabic,
        translation: p.vr.t || DEFAULT_WEDDING_DATA.verse.translation,
      };
    }

    if (p.bk) {
      partial.bankAccounts = {
        ...DEFAULT_WEDDING_DATA.bankAccounts,
        bank1: p.bk.b1 || DEFAULT_WEDDING_DATA.bankAccounts.bank1,
        bank2: p.bk.b2 || DEFAULT_WEDDING_DATA.bankAccounts.bank2,
        giftAddress: p.bk.ga || DEFAULT_WEDDING_DATA.bankAccounts.giftAddress,
        qrisUrl: p.bk.qr || undefined,
      };
    }

    if (Array.isArray(p.st)) {
      partial.stories = p.st.map((s: { id?: string; y?: string; t?: string; d?: string }, idx: number) => ({
        id: s.id || `s-${idx + 1}`,
        year: s.y || '',
        title: s.t || '',
        description: s.d || '',
      }));
    }

    return partial;
  } catch (err) {
    console.warn('Failed to decode wedding payload from URL:', err);
    return null;
  }
}

/**
 * Generates ready-to-use TypeScript code for `lib/wedding-data.ts`
 * allowing users to permanently replace the default values in their repository before deploying to Vercel.
 */
export function generateWeddingDataTsCode(data: WeddingData): string {
  const sanitize = (val: string) => JSON.stringify(val || '');
  const storiesJson = JSON.stringify(data.stories || [], null, 2);
  const galleryJson = JSON.stringify(data.gallery || [], null, 2);

  return `export interface GalleryItem {
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
  weddingDateIso?: string;
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

export const DEFAULT_STORIES: StoryItem[] = ${storiesJson};

export const DEFAULT_GALLERY: GalleryItem[] = ${galleryJson};

export const DEFAULT_WEDDING_DATA: WeddingData = {
  guestName: ${sanitize(data.guestName || 'Bpk. Budi Santoso & Keluarga')},
  groom: {
    name: ${sanitize(data.groom?.name || 'Satria')},
    fullName: ${sanitize(data.groom?.fullName || 'Satria Pratama, S.T.')},
    title: ${sanitize(data.groom?.title || 'Mempelai Pria')},
    parents: ${sanitize(data.groom?.parents || '')},
    instagram: ${sanitize(data.groom?.instagram || '')},
    photoUrl: ${sanitize(data.groom?.photoUrl || '')},
  },
  bride: {
    name: ${sanitize(data.bride?.name || 'Nadia')},
    fullName: ${sanitize(data.bride?.fullName || 'Nadia Angela, S.Ds.')},
    title: ${sanitize(data.bride?.title || 'Mempelai Wanita')},
    parents: ${sanitize(data.bride?.parents || '')},
    instagram: ${sanitize(data.bride?.instagram || '')},
    photoUrl: ${sanitize(data.bride?.photoUrl || '')},
  },
  eventDateDisplay: ${sanitize(data.eventDateDisplay || '24 . 10 . 2026')},
  weddingDateIso: ${sanitize(data.weddingDateIso || '2026-10-24T08:00')},
  akad: {
    title: ${sanitize(data.akad?.title || 'Akad Nikah')},
    date: ${sanitize(data.akad?.date || 'Sabtu, 24 Oktober 2026')},
    time: ${sanitize(data.akad?.time || 'Pukul 08.00 - 10.00 WIB')},
    venue: ${sanitize(data.akad?.venue || 'Masjid Agung')},
    address: ${sanitize(data.akad?.address || '')},
    mapsUrl: ${sanitize(data.akad?.mapsUrl || '')},
  },
  resepsi: {
    title: ${sanitize(data.resepsi?.title || 'Resepsi Pernikahan')},
    date: ${sanitize(data.resepsi?.date || 'Sabtu, 24 Oktober 2026')},
    time: ${sanitize(data.resepsi?.time || 'Pukul 11.30 - 14.30 WIB')},
    venue: ${sanitize(data.resepsi?.venue || 'Grand Ballroom')},
    address: ${sanitize(data.resepsi?.address || '')},
    mapsUrl: ${sanitize(data.resepsi?.mapsUrl || '')},
  },
  verse: {
    surah: ${sanitize(data.verse?.surah || 'QS. Ar-Rum : 21')},
    arabic: ${sanitize(data.verse?.arabic || '')},
    translation: ${sanitize(data.verse?.translation || '')},
  },
  bankAccounts: {
    bank1: {
      name: ${sanitize(data.bankAccounts?.bank1?.name || 'BANK BCA')},
      number: ${sanitize(data.bankAccounts?.bank1?.number || '')},
      holder: ${sanitize(data.bankAccounts?.bank1?.holder || '')},
    },
    bank2: {
      name: ${sanitize(data.bankAccounts?.bank2?.name || 'BANK MANDIRI')},
      number: ${sanitize(data.bankAccounts?.bank2?.number || '')},
      holder: ${sanitize(data.bankAccounts?.bank2?.holder || '')},
    },
    giftAddress: ${sanitize(data.bankAccounts?.giftAddress || '')},
    qrisUrl: ${sanitize(data.bankAccounts?.qrisUrl || '')},
  },
  gallery: DEFAULT_GALLERY,
  stories: DEFAULT_STORIES,
};

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

  const indonesianMatch = dateStr.match(/(\\d{1,2})\\s+([a-zA-Z]+)\\s+(\\d{4})/);
  if (indonesianMatch) {
    const day = parseInt(indonesianMatch[1], 10);
    const monthKey = indonesianMatch[2].toLowerCase();
    const year = parseInt(indonesianMatch[3], 10);
    if (monthMap[monthKey] !== undefined) {
      let hours = 8;
      let minutes = 0;
      const timeMatch = (data.akad?.time || '').match(/(\\d{1,2})[:.](\\d{2})/);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
      }
      const d = new Date(year, monthMap[monthKey], day, hours, minutes);
      if (!isNaN(d.getTime())) return d.getTime();
    }
  }

  const numMatch = (data.eventDateDisplay || '').match(/(\\d{1,2})\\s*[/.-]\\s*(\\d{1,2})\\s*[/.-]\\s*(\\d{4})/);
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
`;
}
