import { useSyncExternalStore } from 'react';
import { WeddingData, DEFAULT_WEDDING_DATA, DEFAULT_GALLERY } from './wedding-data';

const WEDDING_DATA_EVENT = 'royal_wedding_data_updated';
const STORAGE_KEY = 'royal_wedding_data_sn_v2';

let cachedWeddingData: WeddingData = DEFAULT_WEDDING_DATA;
let hasLoadedFromStorage = false;

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((callback) => {
    try {
      callback();
    } catch {
      // ignore
    }
  });
}

function subscribeWeddingData(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== 'undefined') {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        initFromStorage(true);
        callback();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener(WEDDING_DATA_EVENT, callback);

    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(WEDDING_DATA_EVENT, callback);
    };
  }

  return () => {
    listeners.delete(callback);
  };
}

export function normalizeData(parsed: Partial<WeddingData>): WeddingData {
  return {
    ...DEFAULT_WEDDING_DATA,
    ...parsed,
    guestName: typeof parsed.guestName === 'string' && parsed.guestName.trim() ? parsed.guestName.trim() : DEFAULT_WEDDING_DATA.guestName,
    groom: {
      ...DEFAULT_WEDDING_DATA.groom,
      ...(parsed.groom || {}),
    },
    bride: {
      ...DEFAULT_WEDDING_DATA.bride,
      ...(parsed.bride || {}),
    },
    akad: {
      ...DEFAULT_WEDDING_DATA.akad,
      ...(parsed.akad || {}),
    },
    resepsi: {
      ...DEFAULT_WEDDING_DATA.resepsi,
      ...(parsed.resepsi || {}),
    },
    verse: {
      ...DEFAULT_WEDDING_DATA.verse,
      ...(parsed.verse || {}),
    },
    bankAccounts: {
      ...DEFAULT_WEDDING_DATA.bankAccounts,
      ...(parsed.bankAccounts || {}),
    },
    gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : DEFAULT_GALLERY,
  };
}

function initFromStorage(force = false) {
  if (typeof window === 'undefined') return;
  if (hasLoadedFromStorage && !force) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('royal_wedding_data_sn');
    if (raw) {
      cachedWeddingData = normalizeData(JSON.parse(raw));
    }
  } catch (err) {
    console.warn('Failed to parse wedding data from localStorage:', err);
  } finally {
    hasLoadedFromStorage = true;
  }
}

function getWeddingDataClientSnapshot(): WeddingData {
  if (typeof window === 'undefined') return DEFAULT_WEDDING_DATA;
  initFromStorage();
  return cachedWeddingData;
}

function getWeddingDataServerSnapshot(): WeddingData {
  return DEFAULT_WEDDING_DATA;
}

export function saveWeddingData(newData: WeddingData) {
  const normalized = normalizeData(newData);
  // Ensure new immutable reference for useSyncExternalStore comparison
  cachedWeddingData = {
    ...normalized,
    groom: { ...normalized.groom },
    bride: { ...normalized.bride },
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedWeddingData));
    } catch (err) {
      console.warn('LocalStorage save quota or permission issue:', err);
    }
    notifyListeners();
    window.dispatchEvent(new Event(WEDDING_DATA_EVENT));
  }
}

export function resetWeddingData() {
  cachedWeddingData = {
    ...DEFAULT_WEDDING_DATA,
    groom: { ...DEFAULT_WEDDING_DATA.groom },
    bride: { ...DEFAULT_WEDDING_DATA.bride },
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('royal_wedding_data_sn');
    } catch (err) {
      console.warn('LocalStorage reset issue:', err);
    }
    notifyListeners();
    window.dispatchEvent(new Event(WEDDING_DATA_EVENT));
  }
}

export function useWeddingData(): [WeddingData, (d: WeddingData) => void, () => void] {
  const data = useSyncExternalStore(
    subscribeWeddingData,
    getWeddingDataClientSnapshot,
    getWeddingDataServerSnapshot
  );

  return [data, saveWeddingData, resetWeddingData];
}
