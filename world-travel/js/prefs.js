import { put, get } from './db.js';

const KEY = 'main';

const DEFAULTS = {
  key: KEY,
  onboarded: false,
  language: null,
  interests: [],
};

let cache = null;

export async function loadPrefs() {
  if (cache) return cache;
  const stored = await get('prefs', KEY);
  cache = { ...DEFAULTS, ...(stored || {}) };
  return cache;
}

export async function savePrefs(changes) {
  const current = await loadPrefs();
  cache = { ...current, ...changes };
  await put('prefs', cache);
  return cache;
}

export async function getCountryCover(countryId) {
  return get('countryCovers', countryId);
}

export async function setCountryCover(countryId, photoId) {
  await put('countryCovers', { countryId, photoId });
}
