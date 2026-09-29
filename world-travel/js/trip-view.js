import { ensureTripCoverValid } from './trips.js';
import { getCountryById, countryName } from './countries-data.js';
import {
  getTripPhotos,
  addPhotosToTrip,
  updatePhoto,
  deletePhoto,
  reorderPhotos,
  restoreCaptureDateOrder,
  blobUrl,
  brightnessFilter,
} from './photos.js';
import { makeSortable } from './sortable.js';
import { confirmDialog, alertDialog, openSheet } from './ui.js';
import { t, pinLabel, getLang } from './i18n.js';

function openBrightnessSheet(photo, onSave) {
  const wrap = document.createElement('div');
  wrap.className = 'sheet sheet--compact';
  wrap.innerHTML = `
    <div class="sheet__header">
      <h2>${t('brightness')}</h2>
      <button type="button" class="sheet__close" aria-label="${t('close')}">✕</button>
    </div>
    <div class="brightness-editor">
      <img class="brightness-editor__preview" src="${blobUrl('edit-' + photo.id, photo.thumbBlob)}" />
      <input type="range" min="-50" max="50" value="${photo.brightness || 0}" class="brightness-editor__slider" />
    </div>
    <div class="sheet__footer">
      <button type="button" class="btn btn-primary btn-block" data-role="done">${t('done')}</button>
    </div>
  `;
  const img = wrap.querySelector('.brightness-editor__preview');
  const slider = wrap.querySelector('.brightness-editor__slider');
  img.style.filter = brightnessFilter(photo.brightness);
  slider.addEventListener('input', () => {
    img.style.filter = brightnessFilter(Number(slider.value));
  });

  const handle = openSheet(wrap);
  wrap.querySelector('.sheet__close').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-role="done"]').addEventListener('click', () => {
    handle.close();
    onSave(Number(slider.value));
  });
}

export async function renderTrip(container, tripId, { onBack, onDataChanged } = {}) {
  const lang = getLang();
  const trip = await ensureTripCoverValid(tripId);
  const country = await getCountryById(trip.countryId);
  let photos = await getTripPhotos(tripId);

  const coverPhoto = trip.coverPhotoId ? photos.find((p) => p.id === trip.coverPhotoId) : null;
  const feedPhotos = photos.filter((p) => !coverPhoto || p.id !== coverPhoto.id);

  container.innerHTML = `
    <div class="trip-page">
      <div class="trip-page__topbar">
        <button type="button" class="icon-btn" data-role="back" aria-label="${t('close')}">‹</button>
      </div>

      ${trip.title ? `<h1 class="trip-page__title">${escapeHtml(trip.title)}</h1>` : ''}

      <div class="trip-page__cover" data-role="cover"></div>

      <div class="trip-page__meta">
        <span class="trip-page__country">${country.flag} ${countryName(country, lang)}${trip.area ? ' · ' + escapeHtml(trip.area) : ''}</span>
        <span class="trip-page__date">${pinLabel(trip.year, trip.month)}</span>
      </div>

      ${trip.memo ? `<p class="trip-page__memo">${escapeHtml(trip.memo)}</p>` : ''}

      <div class="trip-feed" data-role="feed"></div>

      <input type="file" accept="image/*" multiple hidden data-role="photo-input" />
      <button type="button" class="btn btn-outline btn-block trip-page__add-more" data-role="add-more">${t('addPhotosMore')}</button>
      <button type="button" class="btn btn-ghost btn-block" data-role="restore-order">${t('restoreCaptureOrder')}</button>
    </div>
  `;

  container.querySelector('[data-role="back"]').addEventListener('click', () => onBack?.());

  const coverEl = container.querySelector('[data-role="cover"]');
  if (coverPhoto) {
    coverEl.innerHTML = `<img class="trip-page__cover-img" src="${blobUrl('cover-' + coverPhoto.id, coverPhoto.blob)}" style="filter:${brightnessFilter(coverPhoto.brightness)}" alt="${t('tripCoverAlt')}" />`;
  } else {
    coverEl.innerHTML = `<div class="trip-page__cover-empty"><span class="trip-page__cover-flag">${country.flag}</span><span>${countryName(country, lang)}</span></div>`;
  }

  const feedEl = container.querySelector('[data-role="feed"]');

  function renderFeed() {
    if (feedPhotos.length === 0) {
      feedEl.innerHTML = `<p class="trip-feed__empty">${t('noPhotosYet')}</p>`;
      return;
    }
    feedEl.innerHTML = '';
    for (const photo of feedPhotos) {
      feedEl.appendChild(renderFeedItem(photo));
    }
  }

  function renderFeedItem(photo) {
    const item = document.createElement('div');
    item.className = 'trip-feed__item';
    item.dataset.id = photo.id;
    item.innerHTML = `
      <div class="trip-feed__photo-wrap">
        <img class="trip-feed__photo" src="${blobUrl('feed-' + photo.id, photo.blob)}" style="filter:${brightnessFilter(photo.brightness)}" />
        <div class="trip-feed__actions">
          <button type="button" class="icon-btn icon-btn--soft" data-action="edit" aria-label="${t('editPhoto')}">☀</button>
          <button type="button" class="icon-btn icon-btn--soft" data-action="delete" aria-label="${t('deletePhoto')}">🗑</button>
        </div>
      </div>
      <input type="text" class="trip-feed__caption" placeholder="${t('captionPlaceholder')}" value="${escapeAttr(photo.caption || '')}" />
    `;

    item.querySelector('[data-action="edit"]').addEventListener('click', () => {
      openBrightnessSheet(photo, async (value) => {
        photo.brightness = value;
        await updatePhoto(photo.id, { brightness: value });
        item.querySelector('.trip-feed__photo').style.filter = brightnessFilter(value);
      });
    });

    item.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      const ok = await confirmDialog({
        title: t('deletePhotoConfirmTitle'),
        body: t('deletePhotoConfirmBody'),
        confirmLabel: t('deletePhoto'),
        cancelLabel: t('cancel'),
        danger: true,
      });
      if (!ok) return;
      await deletePhoto(photo.id);
      await ensureTripCoverValid(tripId);
      onDataChanged?.();
      await refresh();
    });

    const captionInput = item.querySelector('.trip-feed__caption');
    captionInput.addEventListener('blur', async () => {
      const value = captionInput.value.trim();
      if (value !== (photo.caption || '')) {
        photo.caption = value;
        await updatePhoto(photo.id, { caption: value });
      }
    });

    return item;
  }

  renderFeed();

  makeSortable(feedEl, '.trip-feed__item', async (orderedIds) => {
    const fullOrder = coverPhoto ? [coverPhoto.id, ...orderedIds] : orderedIds;
    await reorderPhotos(fullOrder);
  });

  container.querySelector('[data-role="restore-order"]').addEventListener('click', async () => {
    await restoreCaptureDateOrder(tripId);
    photos = await getTripPhotos(tripId);
    const newFeed = photos.filter((p) => !coverPhoto || p.id !== coverPhoto.id);
    feedPhotos.length = 0;
    feedPhotos.push(...newFeed);
    renderFeed();
  });

  const photoInput = container.querySelector('[data-role="photo-input"]');
  container.querySelector('[data-role="add-more"]').addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', async () => {
    const files = [...photoInput.files];
    if (!files.length) return;
    try {
      const { saved, failed } = await addPhotosToTrip(tripId, files);
      if (saved.length) {
        await ensureTripCoverValid(tripId);
        onDataChanged?.();
        await refresh();
      }
      if (failed.length) {
        await alertDialog({ title: t('errPhotoTitle'), body: t('errPhotoBody') });
      }
    } catch {
      await alertDialog({ title: t('errStorageTitle'), body: t('errStorageBody') });
    }
    photoInput.value = '';
  });

  async function refresh() {
    await renderTrip(container, tripId, { onBack, onDataChanged });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str) {
  return escapeHtml(str).replaceAll('"', '&quot;');
}
