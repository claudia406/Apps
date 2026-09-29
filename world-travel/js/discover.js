import { get, put } from './db.js';
import { getVisitedCountryIds } from './trips.js';
import { loadPrefs } from './prefs.js';
import { getCountries } from './countries-data.js';

const REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // weekly
const CACHE_KEY = 'current';

let curatedPromise = null;
function loadCurated() {
  if (!curatedPromise) {
    curatedPromise = fetch('data/discover-curated.json').then((r) => r.json());
  }
  return curatedPromise;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weekSeed() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  return now.getFullYear() * 100 + week;
}

async function pickRecommendations() {
  const [curated, prefs, visitedIds, countries] = await Promise.all([
    loadCurated(),
    loadPrefs(),
    getVisitedCountryIds(),
    getCountries(),
  ]);

  const countryById = new Map(countries.map((c) => [c.cca2, c]));
  const visitedSet = new Set(visitedIds);
  const visitedRegions = new Map();
  for (const id of visitedIds) {
    const c = countryById.get(id);
    if (c) visitedRegions.set(c.region, (visitedRegions.get(c.region) || 0) + 1);
  }

  const rng = mulberry32(weekSeed());
  const allowVisited = rng() < 0.15;

  const pool = curated.filter((entry) => allowVisited || !visitedSet.has(entry.id));

  const scored = pool.map((entry) => {
    const overlap = entry.tags.filter((tag) => prefs.interests.includes(tag)).length;
    const country = countryById.get(entry.id);
    const regionBoost = country ? (visitedRegions.get(country.region) || 0) * 0.3 : 0;
    const jitter = rng() * 0.8;
    return { entry, score: overlap * 1.5 + regionBoost + jitter };
  });

  scored.sort((a, b) => b.score - a.score);

  const topPoolSize = Math.min(10, scored.length);
  const topPool = scored.slice(0, topPoolSize);
  const picked = [];
  while (picked.length < 3 && topPool.length > 0) {
    const idx = Math.floor(rng() * topPool.length);
    picked.push(topPool.splice(idx, 1)[0].entry);
  }
  return picked;
}

async function fetchWikipediaSummary(name, lang) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('not ok');
  const data = await res.json();
  return data?.thumbnail?.source || data?.originalimage?.source || null;
}

async function fetchCountryPhoto(country, photoQuery) {
  // Prefer a specific, well-photographed landmark/city (curated per country) so the
  // hero image shows a real place rather than the Wikipedia infobox flag/coat of arms.
  try {
    const src = await fetchWikipediaSummary(photoQuery || country.nameEn, 'en');
    if (src) return src;
  } catch {
    // fall through
  }
  try {
    const src = await fetchWikipediaSummary(country.nameEn, 'en');
    if (src) return src;
  } catch {
    // fall through
  }
  return null;
}

export async function getDiscoverSelections({ forceRefresh = false } = {}) {
  const cached = await get('discoverCache', CACHE_KEY);
  const isFresh = cached && Date.now() - cached.refreshedAt < REFRESH_INTERVAL_MS;

  if (isFresh && !forceRefresh) {
    return { items: cached.items, refreshedAt: cached.refreshedAt, stale: false };
  }

  if (!navigator.onLine) {
    if (cached) return { items: cached.items, refreshedAt: cached.refreshedAt, stale: true };
    return { items: null, refreshedAt: null, stale: false, offline: true };
  }

  try {
    const picks = await pickRecommendations();
    const countries = await getCountries();
    const countryById = new Map(countries.map((c) => [c.cca2, c]));

    const items = await Promise.all(
      picks.map(async (entry) => {
        const country = countryById.get(entry.id);
        const photo = await fetchCountryPhoto(country, entry.photoQuery).catch(() => null);
        return {
          id: entry.id,
          nameEn: country.nameEn,
          nameJa: country.nameJa,
          flag: country.flag,
          photo,
          why: entry.why,
          highlights: entry.highlights,
        };
      })
    );

    const refreshedAt = Date.now();
    await put('discoverCache', { key: CACHE_KEY, items, refreshedAt });
    return { items, refreshedAt, stale: false };
  } catch {
    if (cached) return { items: cached.items, refreshedAt: cached.refreshedAt, stale: true };
    return { items: null, refreshedAt: null, stale: false, error: true };
  }
}
