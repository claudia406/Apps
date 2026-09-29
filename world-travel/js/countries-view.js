import { getCountriesOrderedByFirstVisit, getTripsForCountry } from './trips.js';
import { getCountryById, countryName } from './countries-data.js';
import { getCountryCover, setCountryCover } from './prefs.js';
import { get, getAllByIndex } from './db.js';
import { blobUrl, brightnessFilter } from './photos.js';
import { openSheet } from './ui.js';
import { t, pinLabel, getLang } from './i18n.js';

async function resolveCountryCoverPhoto(countryId, trips) {
  const override = await getCountryCover(countryId);
  if (override?.photoId) {
    const photo = await get('photos', override.photoId);
    if (photo) return photo;
  }
  for (const trip of trips) {
    if (trip.coverPhotoId) {
      const photo = await get('photos', trip.coverPhotoId);
      if (photo) return photo;
    }
  }
  return null;
}

export async function renderCountries(container, { onOpenCountry } = {}) {
  const lang = getLang();
  const ordered = await getCountriesOrderedByFirstVisit();

  if (ordered.length === 0) {
    container.innerHTML = `
      <div class="screen-header"><h1>${t('countriesTitle')}</h1></div>
      <div class="empty-state">
        <p>${t('countriesEmpty').replaceAll('\n', '<br/>')}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="screen-header"><h1>${t('countriesTitle')}</h1></div>
    <div class="country-card-grid" data-role="grid"></div>
  `;
  const grid = container.querySelector('[data-role="grid"]');

  for (const entry of ordered) {
    const country = await getCountryById(entry.countryId);
    if (!country) continue;
    const trips = await getTripsForCountry(entry.countryId);
    const cover = await resolveCountryCoverPhoto(entry.countryId, trips);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'country-card';
    card.innerHTML = cover
      ? `<div class="country-card__photo" style="background-image:url('${blobUrl('ccard-' + cover.id, cover.thumbBlob)}');filter:${brightnessFilter(cover.brightness)}"></div>`
      : `<div class="country-card__photo country-card__photo--empty"><span>${country.flag}</span></div>`;
    card.innerHTML += `<div class="country-card__name">${countryName(country, lang)}</div>`;

    card.addEventListener('click', () => onOpenCountry?.(entry.countryId));
    grid.appendChild(card);
  }
}

export async function renderCountryPage(container, countryId, { onBack, onOpenTrip } = {}) {
  const lang = getLang();
  const country = await getCountryById(countryId);
  const trips = await getTripsForCountry(countryId);
  const cover = await resolveCountryCoverPhoto(countryId, trips);

  container.innerHTML = `
    <div class="trip-page">
      <div class="trip-page__topbar">
        <button type="button" class="icon-btn" data-role="back">‹</button>
      </div>
      <div class="country-page__hero" data-role="hero">
        ${cover
          ? `<div class="country-page__photo" style="background-image:url('${blobUrl('chero-' + cover.id, cover.thumbBlob)}');filter:${brightnessFilter(cover.brightness)}"></div>`
          : `<div class="country-page__photo country-page__photo--empty"><span>${country.flag}</span></div>`}
        <button type="button" class="btn btn-outline country-page__change-cover" data-role="change-cover">${t('changeCover')}</button>
      </div>
      <h1 class="country-page__name">${country.flag} ${countryName(country, lang)}</h1>
      <div class="trip-list" data-role="trip-list"></div>
    </div>
  `;

  container.querySelector('[data-role="back"]').addEventListener('click', () => onBack?.());

  const listEl = container.querySelector('[data-role="trip-list"]');
  for (const trip of trips) {
    const tripCover = trip.coverPhotoId ? await get('photos', trip.coverPhotoId) : null;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'trip-list__item';
    item.innerHTML = `
      ${tripCover
        ? `<div class="trip-list__photo" style="background-image:url('${blobUrl('tlist-' + tripCover.id, tripCover.thumbBlob)}');filter:${brightnessFilter(tripCover.brightness)}"></div>`
        : `<div class="trip-list__photo trip-list__photo--empty"><span>${country.flag}</span></div>`}
      <div class="trip-list__info">
        <span class="trip-list__date">${pinLabel(trip.year, trip.month)}</span>
        ${trip.title ? `<span class="trip-list__title">${trip.title}</span>` : ''}
      </div>
    `;
    item.addEventListener('click', () => onOpenTrip?.(trip.id));
    listEl.appendChild(item);
  }

  container.querySelector('[data-role="change-cover"]').addEventListener('click', async () => {
    const allPhotos = [];
    for (const trip of trips) {
      const photos = await getAllByIndex('photos', 'byTrip', trip.id);
      allPhotos.push(...photos);
    }
    if (!allPhotos.length) return;

    const wrap = document.createElement('div');
    wrap.className = 'sheet sheet--full';
    wrap.innerHTML = `
      <div class="sheet__header">
        <h2>${t('selectCoverPhoto')}</h2>
        <button type="button" class="sheet__close">✕</button>
      </div>
      <div class="cover-picker-grid" data-role="grid"></div>
    `;
    const pickerGrid = wrap.querySelector('[data-role="grid"]');
    for (const photo of allPhotos) {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'cover-picker-grid__tile';
      tile.innerHTML = `<img src="${blobUrl('cpick-' + photo.id, photo.thumbBlob)}" style="filter:${brightnessFilter(photo.brightness)}" />`;
      tile.addEventListener('click', async () => {
        await setCountryCover(countryId, photo.id);
        handle.close();
        await renderCountryPage(container, countryId, { onBack, onOpenTrip });
      });
      pickerGrid.appendChild(tile);
    }
    const handle = openSheet(wrap);
    wrap.querySelector('.sheet__close').addEventListener('click', () => handle.close());
  });
}
