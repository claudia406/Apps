import { put, get, getAllByIndex, del, delWhere, newId } from './db.js';
import { getPhotoCaptureDate } from './exif.js';

const THUMB_MAX_DIM = 900;
const THUMB_QUALITY = 0.82;

async function makeThumbnail(file) {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;

  let { width, height } = bitmap;
  const scale = Math.min(1, THUMB_MAX_DIM / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', THUMB_QUALITY)
  );
  return blob;
}

export async function addPhotosToTrip(tripId, files) {
  const existing = await getAllByIndex('photos', 'byTrip', tripId);
  let nextOrder = existing.length ? Math.max(...existing.map((p) => p.sortOrder)) + 1 : 0;
  const saved = [];
  const failed = [];

  for (const file of files) {
    try {
      const [captureDate, thumbBlob] = await Promise.all([
        getPhotoCaptureDate(file),
        makeThumbnail(file),
      ]);
      if (!thumbBlob) {
        failed.push(file.name);
        continue;
      }
      const photo = {
        id: newId(),
        tripId,
        blob: file,
        thumbBlob,
        captureDate: (captureDate || new Date(file.lastModified || Date.now())).getTime(),
        addedAt: Date.now(),
        brightness: 0,
        caption: '',
        sortOrder: nextOrder++,
      };
      await put('photos', photo);
      saved.push(photo);
    } catch {
      failed.push(file.name);
    }
  }
  return { saved, failed };
}

export async function getTripPhotos(tripId) {
  const photos = await getAllByIndex('photos', 'byTrip', tripId);
  return photos.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function reorderPhotos(orderedIds) {
  await Promise.all(
    orderedIds.map((id, index) =>
      get('photos', id).then((photo) => {
        if (!photo) return;
        photo.sortOrder = index;
        return put('photos', photo);
      })
    )
  );
}

export async function restoreCaptureDateOrder(tripId) {
  const photos = await getTripPhotos(tripId);
  photos.sort((a, b) => a.captureDate - b.captureDate || a.addedAt - b.addedAt);
  await reorderPhotos(photos.map((p) => p.id));
  return photos.map((p) => p.id);
}

export async function updatePhoto(photoId, changes) {
  const photo = await get('photos', photoId);
  if (!photo) return null;
  Object.assign(photo, changes);
  await put('photos', photo);
  return photo;
}

export async function deletePhoto(photoId) {
  await del('photos', photoId);
}

export async function deleteTripPhotos(tripId) {
  await delWhere('photos', 'byTrip', tripId);
}

const urlCache = new Map();

export function blobUrl(cacheKey, blob) {
  if (!blob) return null;
  if (urlCache.has(cacheKey)) return urlCache.get(cacheKey);
  const url = URL.createObjectURL(blob);
  urlCache.set(cacheKey, url);
  return url;
}

export function brightnessFilter(value) {
  const clamped = Math.max(-50, Math.min(50, value || 0));
  const pct = 1 + clamped / 100;
  return `brightness(${pct.toFixed(2)})`;
}
