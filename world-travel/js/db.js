const DB_NAME = 'world-travel-db';
const DB_VERSION = 1;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('trips')) {
        const trips = db.createObjectStore('trips', { keyPath: 'id' });
        trips.createIndex('byCountry', 'countryId');
        trips.createIndex('byCreatedAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('photos')) {
        const photos = db.createObjectStore('photos', { keyPath: 'id' });
        photos.createIndex('byTrip', 'tripId');
      }
      if (!db.objectStoreNames.contains('countryCovers')) {
        db.createObjectStore('countryCovers', { keyPath: 'countryId' });
      }
      if (!db.objectStoreNames.contains('prefs')) {
        db.createObjectStore('prefs', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('discoverCache')) {
        db.createObjectStore('discoverCache', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(storeNames, mode) {
  return openDb().then((db) => db.transaction(storeNames, mode));
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function put(storeName, value) {
  const t = await tx([storeName], 'readwrite');
  const store = t.objectStore(storeName);
  const result = await reqToPromise(store.put(value));
  return new Promise((resolve, reject) => {
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
  });
}

export async function get(storeName, key) {
  const t = await tx([storeName], 'readonly');
  return reqToPromise(t.objectStore(storeName).get(key));
}

export async function getAll(storeName) {
  const t = await tx([storeName], 'readonly');
  return reqToPromise(t.objectStore(storeName).getAll());
}

export async function getAllByIndex(storeName, indexName, query) {
  const t = await tx([storeName], 'readonly');
  const idx = t.objectStore(storeName).index(indexName);
  return reqToPromise(idx.getAll(query));
}

export async function del(storeName, key) {
  const t = await tx([storeName], 'readwrite');
  t.objectStore(storeName).delete(key);
  return new Promise((resolve, reject) => {
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export async function delWhere(storeName, indexName, query) {
  const t = await tx([storeName], 'readwrite');
  const idx = t.objectStore(storeName).index(indexName);
  const cursorReq = idx.openCursor(query);
  await new Promise((resolve, reject) => {
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });
  return new Promise((resolve, reject) => {
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function requestPersistentStorage() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      await navigator.storage.persist();
    }
  } catch {
    // best-effort only
  }
}
