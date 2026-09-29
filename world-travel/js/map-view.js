import { getCountries, countryName } from './countries-data.js';
import { getTripsForCountry, getCountriesOrderedByFirstVisit } from './trips.js';
import { getCountryCover } from './prefs.js';
import { get } from './db.js';
import { blobUrl, brightnessFilter } from './photos.js';
import { getLang, pinLabel } from './i18n.js';

const WIDTH = 1000;
const HEIGHT = 500;

function project(lat, lng) {
  const x = ((lng + 180) / 360) * WIDTH;
  const y = ((90 - lat) / 180) * HEIGHT;
  return { x, y };
}

let svgTextCache = null;
let onCountryOpen = null;

async function getSvgText() {
  if (!svgTextCache) {
    const res = await fetch('assets/world-map.svg');
    svgTextCache = await res.text();
  }
  return svgTextCache;
}

async function resolveCountryCoverPhoto(countryId) {
  const override = await getCountryCover(countryId);
  let photoId = override?.photoId || null;

  if (!photoId) {
    const trips = await getTripsForCountry(countryId);
    for (const trip of trips) {
      if (trip.coverPhotoId) {
        photoId = trip.coverPhotoId;
        break;
      }
    }
  }
  if (!photoId) return null;
  const photo = await get('photos', photoId);
  return photo || null;
}

function showBottomCard(country, photo, lang) {
  document.getElementById('map-bottom-card')?.remove();

  const card = document.createElement('div');
  card.id = 'map-bottom-card';
  card.className = 'map-bottom-card';

  const mediaHtml = photo
    ? `<div class="map-bottom-card__photo" style="background-image:url('${blobUrl('mapcard-' + photo.id, photo.thumbBlob)}');filter:${brightnessFilter(photo.brightness)}"></div>`
    : `<div class="map-bottom-card__photo map-bottom-card__photo--empty"><span>${country.flag}</span></div>`;

  card.innerHTML = `
    ${mediaHtml}
    <div class="map-bottom-card__label">
      <span class="map-bottom-card__flag">${country.flag}</span>
      <span class="map-bottom-card__name">${countryName(country, lang)}</span>
    </div>
  `;
  card.addEventListener('click', () => {
    card.remove();
    onCountryOpen?.(country.cca2);
  });

  document.getElementById('map-screen')?.appendChild(card);
  requestAnimationFrame(() => card.classList.add('is-open'));

  setTimeout(() => {
    document.addEventListener(
      'click',
      function outside(e) {
        if (!card.contains(e.target)) card.remove();
        document.removeEventListener('click', outside);
      },
      { once: true }
    );
  }, 0);
}

export function setOnCountryOpen(fn) {
  onCountryOpen = fn;
}

const HOME_LON = 138; // centers the initial map view on Japan

export async function renderMap(container) {
  const svgText = await getSvgText();
  container.innerHTML = svgText;
  const svgRoot = container.querySelector('svg');
  svgRoot.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const pinLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  pinLayer.setAttribute('id', 'pin-layer');
  svgRoot.appendChild(pinLayer);

  const [countries, visits] = await Promise.all([getCountries(), getCountriesOrderedByFirstVisit()]);
  const byId = new Map(countries.map((c) => [c.cca2, c]));
  const lang = getLang();

  for (const visit of visits) {
    const country = byId.get(visit.countryId);
    if (!country) continue;
    const { x, y } = project(country.lat, country.lng);
    const label = pinLabel(visit.firstYear, visit.firstMonth);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'map-pin');
    g.setAttribute('transform', `translate(${x},${y})`);
    g.style.cursor = 'pointer';

    const textWidth = Math.max(34, label.length * 6.4 + 10);
    g.innerHTML = `
      <circle r="4.2" cy="0" class="map-pin__dot"></circle>
      <rect x="${-textWidth / 2}" y="-19" width="${textWidth}" height="14" rx="7" class="map-pin__badge"></rect>
      <text x="0" y="-9" text-anchor="middle" class="map-pin__text">${label}</text>
    `;

    g.addEventListener('click', async (e) => {
      e.stopPropagation();
      const photo = await resolveCountryCoverPhoto(country.cca2);
      showBottomCard(country, photo, lang);
    });

    pinLayer.appendChild(g);
  }

  requestAnimationFrame(() => {
    const totalWidth = svgRoot.getBoundingClientRect().width;
    const fraction = (HOME_LON + 180) / 360;
    const target = fraction * totalWidth - container.clientWidth / 2;
    container.scrollLeft = Math.max(0, Math.min(target, totalWidth - container.clientWidth));
  });
}
