import { useSyncExternalStore } from 'react';
import { WeddingData, DEFAULT_WEDDING_DATA, DEFAULT_GALLERY, DEFAULT_STORIES } from './wedding-data';

const WEDDING_DATA_EVENT = 'royal_wedding_data_updated';
const STORAGE_KEY = 'royal_wedding_data_sn_v2';

let cachedWeddingData: WeddingData = DEFAULT_WEDDING_DATA;
let hasLoadedFromStorage = false;
let hasHydrated = false;
let hasSyncedFromServer = false;

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

function initFromStorage(force = false): boolean {
  if (typeof window === 'undefined') return false;
  if (hasLoadedFromStorage && !force) return false;

  let changed = false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('royal_wedding_data_sn');
    if (raw) {
      cachedWeddingData = normalizeData(JSON.parse(raw));
      changed = true;
    }
  } catch (err) {
    console.warn('Failed to parse wedding data from localStorage:', err);
  } finally {
    hasLoadedFromStorage = true;
  }
  return changed;
}

// Background fetch from /api/wedding-data to synchronize other devices
async function syncFromServerApi() {
  if (typeof window === 'undefined' || hasSyncedFromServer) return;
  hasSyncedFromServer = true;

  try {
    const res = await fetch('/api/wedding-data');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.hasCustomData && json.data) {
        // If current local data is default or older, apply server data
        const serverNormalized = normalizeData(json.data);
        cachedWeddingData = serverNormalized;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverNormalized));
        } catch {
          // ignore
        }
        notifyListeners();
        window.dispatchEvent(new Event(WEDDING_DATA_EVENT));
      }
    }
  } catch {
    // ignore offline or failed sync
  }
}

function subscribeWeddingData(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== 'undefined') {
    // On mount (after hydration complete), load from storage and trigger clean client update
    if (!hasHydrated) {
      hasHydrated = true;
      const hadData = initFromStorage(true);
      if (hadData) {
        callback();
      }
      // Check server API in background
      syncFromServerApi();
    }

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
      qrisUrl: typeof parsed.bankAccounts?.qrisUrl === 'string' ? parsed.bankAccounts.qrisUrl : (DEFAULT_WEDDING_DATA.bankAccounts.qrisUrl || ''),
    },
    weddingDateIso: typeof parsed.weddingDateIso === 'string' && parsed.weddingDateIso ? parsed.weddingDateIso : DEFAULT_WEDDING_DATA.weddingDateIso,
    gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : DEFAULT_GALLERY,
    stories: Array.isArray(parsed.stories) && parsed.stories.length > 0 ? parsed.stories : DEFAULT_STORIES,
  };
}

function getWeddingDataClientSnapshot(): WeddingData {
  if (typeof window === 'undefined' || !hasHydrated) return DEFAULT_WEDDING_DATA;
  return cachedWeddingData;
}

function getWeddingDataServerSnapshot(): WeddingData {
  return DEFAULT_WEDDING_DATA;
}

export function saveWeddingData(newData: WeddingData) {
  hasHydrated = true;
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

    // Also sync to server API route asynchronously
    fetch('/api/wedding-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cachedWeddingData),
    }).catch(() => {});
  }
}

export function applyDecodedUrlData(partial: Partial<WeddingData>) {
  const merged = normalizeData({
    ...cachedWeddingData,
    ...partial,
    groom: { ...cachedWeddingData.groom, ...(partial.groom || {}) },
    bride: { ...cachedWeddingData.bride, ...(partial.bride || {}) },
    akad: { ...cachedWeddingData.akad, ...(partial.akad || {}) },
    resepsi: { ...cachedWeddingData.resepsi, ...(partial.resepsi || {}) },
    verse: { ...cachedWeddingData.verse, ...(partial.verse || {}) },
    bankAccounts: { ...cachedWeddingData.bankAccounts, ...(partial.bankAccounts || {}) },
    stories: Array.isArray(partial.stories) && partial.stories.length > 0 ? partial.stories : cachedWeddingData.stories,
    gallery: Array.isArray(partial.gallery) && partial.gallery.length > 0 ? partial.gallery : cachedWeddingData.gallery,
  });
  saveWeddingData(merged);
}

export function resetWeddingData() {
  hasHydrated = true;
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
