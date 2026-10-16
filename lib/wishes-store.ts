import { useSyncExternalStore } from 'react';

export interface Wish {
  id: string;
  name: string;
  status: string;
  pax: number;
  message: string;
  timeAgo: string;
}

export const DEFAULT_WISHES: Wish[] = [
  {
    id: 'w-1',
    name: 'Bpk. Hendra & Ibu Maria (Keluarga Besar Pratama)',
    status: 'Hadir',
    pax: 2,
    message: 'Barakallahu laka wa baraka alaika wa jamaa bainakuma fii khoir. Selamat menempuh hidup baru Satria & Nadia, semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
    timeAgo: 'Baru saja',
  },
  {
    id: 'w-2',
    name: 'Dr. Johanes Wijaya',
    status: 'Hadir',
    pax: 2,
    message: 'Selamat berbahagia untuk kedua mempelai! Semoga senantiasa dilimpahi berkah, rezeki yang berkah, dan kebahagiaan dunia akhirat.',
    timeAgo: '2 jam yang lalu',
  },
  {
    id: 'w-3',
    name: 'Aisyah & Rekan Kerja',
    status: 'Hadir',
    pax: 1,
    message: 'Masya Allah terharu banget melihat Nadia & Satria akhirnya bersanding di pelaminan. Semoga langgeng sampai kakek nenek ya!',
    timeAgo: '5 jam yang lalu',
  },
  {
    id: 'w-4',
    name: 'Kevin Samuel',
    status: 'Berhalangan',
    pax: 0,
    message: 'Turut berbahagia untuk Satria & Nadia! Mohon maaf belum bisa hadir secara langsung karena sedang bertugas di luar kota, doa terbaik kami menyertai kalian berdua.',
    timeAgo: '1 hari yang lalu',
  },
];

const WISHES_EVENT = 'royal_wishes_updated_event';
const STORAGE_KEY = 'royal_wedding_wishes_sn';

let cachedWishes: Wish[] = DEFAULT_WISHES;
let cachedRawWishes: string | null = null;
let hasWishesHydrated = false;

function loadWishesFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && raw !== cachedRawWishes) {
      cachedRawWishes = raw;
      cachedWishes = JSON.parse(raw);
      return true;
    }
  } catch {
    cachedWishes = DEFAULT_WISHES;
  }
  return false;
}

function subscribeWishes(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  if (!hasWishesHydrated) {
    hasWishesHydrated = true;
    const changed = loadWishesFromStorage();
    if (changed) {
      callback();
    }
  }

  const handleUpdate = () => {
    loadWishesFromStorage();
    callback();
  };

  window.addEventListener('storage', handleUpdate);
  window.addEventListener(WISHES_EVENT, handleUpdate);
  return () => {
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener(WISHES_EVENT, handleUpdate);
  };
}

function getWishesClientSnapshot(): Wish[] {
  if (typeof window === 'undefined' || !hasWishesHydrated) return DEFAULT_WISHES;
  return cachedWishes;
}

function getWishesServerSnapshot(): Wish[] {
  return DEFAULT_WISHES;
}

export function addWishToStorage(newWish: Wish) {
  hasWishesHydrated = true;
  if (typeof window !== 'undefined') {
    try {
      const current = cachedWishes;
      const updated = [newWish, ...current];
      cachedWishes = updated;
      cachedRawWishes = JSON.stringify(updated);
      localStorage.setItem(STORAGE_KEY, cachedRawWishes);
      window.dispatchEvent(new Event(WISHES_EVENT));
    } catch {
      // fallback
    }
  }
}

export function useWishes(): [Wish[], (w: Wish) => void] {
  const wishes = useSyncExternalStore(
    subscribeWishes,
    getWishesClientSnapshot,
    getWishesServerSnapshot
  );

  return [wishes, addWishToStorage];
}
