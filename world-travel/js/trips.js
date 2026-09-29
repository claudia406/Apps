import { put, get, getAll, getAllByIndex, del, newId } from './db.js';
import { deleteTripPhotos, getTripPhotos } from './photos.js';

export async function createTrip({ countryId, area, year, month, title, memo }) {
  const trip = {
    id: newId(),
    countryId,
    area: area || '',
    year,
    month,
    title: title || '',
    memo: memo || '',
    coverPhotoId: null,
    createdAt: Date.now(),
  };
  await put('trips', trip);
  return trip;
}

export async function getTrip(tripId) {
  return get('trips', tripId);
}

export async function getAllTrips() {
  return getAll('trips');
}

export async function getTripsForCountry(countryId) {
  const trips = await getAllByIndex('trips', 'byCountry', countryId);
  return trips.sort((a, b) => a.createdAt - b.createdAt);
}

export async function setTripCover(tripId, photoId) {
  const trip = await get('trips', tripId);
  if (!trip) return;
  trip.coverPhotoId = photoId;
  await put('trips', trip);
}

export async function ensureTripCoverValid(tripId) {
  const trip = await get('trips', tripId);
  if (!trip) return;
  const photos = await getTripPhotos(tripId);
  if (photos.length === 0) {
    trip.coverPhotoId = null;
  } else if (!photos.some((p) => p.id === trip.coverPhotoId)) {
    trip.coverPhotoId = photos[0].id;
  }
  await put('trips', trip);
  return trip;
}

export async function deleteTrip(tripId) {
  await deleteTripPhotos(tripId);
  await del('trips', tripId);
}

export async function getFirstVisit(countryId) {
  const trips = await getTripsForCountry(countryId);
  if (trips.length === 0) return null;
  let earliest = trips[0];
  for (const t of trips) {
    if (t.year < earliest.year || (t.year === earliest.year && t.month < earliest.month)) {
      earliest = t;
    }
  }
  return earliest;
}

export async function getVisitedCountryIds() {
  const trips = await getAllTrips();
  return [...new Set(trips.map((t) => t.countryId))];
}

export async function getCountriesOrderedByFirstVisit() {
  const trips = await getAllTrips();
  const byCountry = new Map();
  for (const t of trips) {
    const key = t.countryId;
    const existing = byCountry.get(key);
    const rank = t.year * 12 + t.month;
    if (!existing || rank < existing.rank) {
      byCountry.set(key, { rank, firstYear: t.year, firstMonth: t.month });
    }
  }
  return [...byCountry.entries()]
    .sort((a, b) => a[1].rank - b[1].rank)
    .map(([countryId, info]) => ({ countryId, ...info }));
}
