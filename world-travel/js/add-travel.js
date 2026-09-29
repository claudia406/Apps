import { getCountries, countryName } from './countries-data.js';
import { createTrip, setTripCover } from './trips.js';
import { addPhotosToTrip } from './photos.js';
import { openSheet, alertDialog } from './ui.js';
import { t, monthName, getLang } from './i18n.js';

function buildCountryPickerSheet(countries, lang, onSelect) {
  const wrap = document.createElement('div');
  wrap.className = 'sheet sheet--full';
  wrap.innerHTML = `
    <div class="sheet__header">
      <h2>${t('selectCountryTitle')}</h2>
      <button type="button" class="sheet__close" aria-label="${t('close')}">✕</button>
    </div>
    <div class="country-list" role="listbox"></div>
  `;
  const list = wrap.querySelector('.country-list');
  for (const c of countries) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'country-list__item';
    item.innerHTML = `<span class="country-list__flag">${c.flag}</span><span>${countryName(c, lang)}</span>`;
    item.addEventListener('click', () => onSelect(c));
    list.appendChild(item);
  }
  return wrap;
}

export async function openAddTravelSheet({ onSaved, presetCountryId } = {}) {
  const lang = getLang();
  const countries = await getCountries();
  const now = new Date();

  let selectedCountry = presetCountryId ? countries.find((c) => c.cca2 === presetCountryId) : null;
  let selectedFiles = [];
  let coverIndex = 0;

  const wrap = document.createElement('div');
  wrap.className = 'sheet sheet--form';

  const years = [];
  for (let y = now.getFullYear(); y >= 1970; y--) years.push(y);

  wrap.innerHTML = `
    <div class="sheet__header">
      <h2>${t('addTravelTitle')}</h2>
      <button type="button" class="sheet__close" aria-label="${t('close')}">✕</button>
    </div>
    <div class="sheet__body">
      <label class="field-label">${t('fieldCountry')}</label>
      <button type="button" class="field-select" data-role="country-btn">
        <span data-role="country-value">${t('fieldCountryPlaceholder')}</span>
        <span class="field-select__chevron">›</span>
      </button>

      <label class="field-label" for="af-area">${t('fieldArea')}</label>
      <input id="af-area" class="field-input" type="text" placeholder="${t('fieldAreaPlaceholder')}" />

      <label class="field-label">${t('fieldYearMonth')}</label>
      <div class="field-row">
        <select class="field-select field-select--inline" data-role="year"></select>
        <select class="field-select field-select--inline" data-role="month"></select>
      </div>

      <label class="field-label" for="af-title">${t('fieldTitle')}</label>
      <input id="af-title" class="field-input" type="text" placeholder="${t('fieldTitlePlaceholder')}" />

      <label class="field-label" for="af-memo">${t('fieldMemo')}</label>
      <textarea id="af-memo" class="field-input field-textarea" placeholder="${t('fieldMemoPlaceholder')}"></textarea>

      <label class="field-label">${t('fieldPhotos')}</label>
      <input type="file" accept="image/*" multiple hidden data-role="photo-input" />
      <button type="button" class="btn btn-outline" data-role="photo-btn">${t('addPhotos')}</button>
      <p class="field-hint" data-role="photo-count"></p>
      <div class="photo-preview-strip" data-role="photo-strip"></div>
    </div>
    <div class="sheet__footer">
      <button type="button" class="btn btn-primary btn-block" data-role="save" disabled>${t('save')}</button>
    </div>
  `;

  const yearSelect = wrap.querySelector('[data-role="year"]');
  for (const y of years) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (y === now.getFullYear()) opt.selected = true;
    yearSelect.appendChild(opt);
  }
  const monthSelect = wrap.querySelector('[data-role="month"]');
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = monthName(m);
    if (m === now.getMonth() + 1) opt.selected = true;
    monthSelect.appendChild(opt);
  }

  const countryBtn = wrap.querySelector('[data-role="country-btn"]');
  const countryValue = wrap.querySelector('[data-role="country-value"]');
  const saveBtn = wrap.querySelector('[data-role="save"]');

  function refreshCountryLabel() {
    if (selectedCountry) {
      countryValue.textContent = `${selectedCountry.flag}  ${countryName(selectedCountry, lang)}`;
      countryValue.classList.remove('is-placeholder');
      saveBtn.disabled = false;
    }
  }
  if (selectedCountry) refreshCountryLabel();
  else countryValue.classList.add('is-placeholder');

  countryBtn.addEventListener('click', () => {
    const picker = buildCountryPickerSheet(countries, lang, (c) => {
      selectedCountry = c;
      refreshCountryLabel();
      pickerHandle.close();
    });
    const pickerHandle = openSheet(picker);
    picker.querySelector('.sheet__close').addEventListener('click', () => pickerHandle.close());
  });

  const photoInput = wrap.querySelector('[data-role="photo-input"]');
  const photoBtn = wrap.querySelector('[data-role="photo-btn"]');
  const photoCount = wrap.querySelector('[data-role="photo-count"]');
  const photoStrip = wrap.querySelector('[data-role="photo-strip"]');

  function renderPhotoStrip() {
    photoStrip.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'photo-preview-strip__tile' + (index === coverIndex ? ' is-cover' : '');
      tile.innerHTML = `<img src="${url}" class="photo-preview-strip__thumb" /><span class="photo-preview-strip__badge">${index === coverIndex ? '★' : ''}</span>`;
      tile.addEventListener('click', () => {
        coverIndex = index;
        renderPhotoStrip();
      });
      photoStrip.appendChild(tile);
    });
  }

  photoBtn.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', () => {
    selectedFiles = [...photoInput.files];
    coverIndex = 0;
    photoCount.textContent = selectedFiles.length ? t('photosSelected', { n: selectedFiles.length }) : '';
    renderPhotoStrip();
  });

  const handle = openSheet(wrap);
  wrap.querySelector('.sheet__close').addEventListener('click', () => handle.close());

  saveBtn.addEventListener('click', async () => {
    if (!selectedCountry) return;
    saveBtn.disabled = true;
    saveBtn.textContent = '…';
    try {
      const trip = await createTrip({
        countryId: selectedCountry.cca2,
        area: wrap.querySelector('#af-area').value.trim(),
        year: Number(yearSelect.value),
        month: Number(monthSelect.value),
        title: wrap.querySelector('#af-title').value.trim(),
        memo: wrap.querySelector('#af-memo').value.trim(),
      });
      if (selectedFiles.length) {
        const { saved } = await addPhotosToTrip(trip.id, selectedFiles);
        const coverPhoto = saved[coverIndex] || saved[0];
        if (coverPhoto) await setTripCover(trip.id, coverPhoto.id);
      }
      handle.close();
      onSaved?.(trip);
    } catch (err) {
      saveBtn.disabled = false;
      saveBtn.textContent = t('save');
      await alertDialog({ title: t('errStorageTitle'), body: t('errStorageBody') });
    }
  });
}
