import { requestPersistentStorage } from './db.js';
import { loadPrefs } from './prefs.js';
import { setLang, t } from './i18n.js';
import { renderOnboarding } from './onboarding.js';
import { renderMap, setOnCountryOpen } from './map-view.js';
import { renderCountries, renderCountryPage } from './countries-view.js';
import { renderDiscover } from './discover-view.js';
import { renderTrip } from './trip-view.js';
import { renderSettings } from './settings-view.js';
import { openAddTravelSheet } from './add-travel.js';
import { openSheet } from './ui.js';

const viewRoot = document.getElementById('view-root');
const bottomNav = document.getElementById('bottom-nav');
const fab = document.getElementById('fab-add-travel');
const settingsBtn = document.getElementById('settings-btn');
const onboardRoot = document.getElementById('onboard-root');
const appShell = document.getElementById('app');

const state = {
  activeTab: 'map',
  stack: [], // pushed detail views on top of the active tab: { type: 'country' | 'trip', id }
};

function updateFabVisibility() {
  fab.hidden = !(state.activeTab === 'map' && state.stack.length === 0);
}

function updateNavActive() {
  bottomNav.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.tab === state.activeTab && state.stack.length === 0);
  });
}

function pushDetail(view) {
  state.stack.push(view);
  render();
}

function popDetail() {
  state.stack.pop();
  render();
}

async function render() {
  updateFabVisibility();
  updateNavActive();

  const top = state.stack[state.stack.length - 1];

  if (top?.type === 'trip') {
    await renderTrip(viewRoot, top.id, {
      onBack: popDetail,
      onDataChanged: () => {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) renderMap(mapContainer).catch(() => {});
      },
    });
    return;
  }

  if (top?.type === 'country') {
    await renderCountryPage(viewRoot, top.id, {
      onBack: popDetail,
      onOpenTrip: (tripId) => pushDetail({ type: 'trip', id: tripId }),
    });
    return;
  }

  if (state.activeTab === 'map') {
    viewRoot.innerHTML = `<div id="map-screen" class="map-screen"><div id="map-container" class="map-container"></div></div>`;
    setOnCountryOpen((countryId) => pushDetail({ type: 'country', id: countryId }));
    await renderMap(document.getElementById('map-container'));
  } else if (state.activeTab === 'countries') {
    await renderCountries(viewRoot, {
      onOpenCountry: (countryId) => pushDetail({ type: 'country', id: countryId }),
    });
  } else if (state.activeTab === 'discover') {
    await renderDiscover(viewRoot);
  }
}

function goToTab(tab) {
  state.activeTab = tab;
  state.stack = [];
  render();
}

bottomNav.querySelectorAll('[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => goToTab(btn.dataset.tab));
});

fab.addEventListener('click', () => {
  openAddTravelSheet({
    onSaved: () => render(),
  });
});

settingsBtn.addEventListener('click', () => {
  const wrap = document.createElement('div');
  wrap.className = 'sheet sheet--full';
  wrap.innerHTML = `<div class="sheet__header"><span></span><button type="button" class="sheet__close">✕</button></div><div class="sheet__body" data-role="settings-body"></div>`;
  const handle = openSheet(wrap);
  wrap.querySelector('.sheet__close').addEventListener('click', () => handle.close());
  renderSettings(wrap.querySelector('[data-role="settings-body"]'), {
    onLanguageChanged: () => {
      handle.close();
      render();
    },
  });
});

function applyNavLabels() {
  bottomNav.querySelector('[data-tab="map"] .nav-label').textContent = t('navMap');
  bottomNav.querySelector('[data-tab="countries"] .nav-label').textContent = t('navCountries');
  bottomNav.querySelector('[data-tab="discover"] .nav-label').textContent = t('navDiscover');
  fab.textContent = t('addTravel');
}

async function boot() {
  const prefs = await loadPrefs();
  requestPersistentStorage();

  if (prefs.language) {
    setLang(prefs.language);
  }

  if (!prefs.onboarded) {
    onboardRoot.hidden = false;
    appShell.hidden = true;
    renderOnboarding(onboardRoot, async () => {
      onboardRoot.hidden = true;
      appShell.hidden = false;
      applyNavLabels();
      await render();
    });
    return;
  }

  onboardRoot.hidden = true;
  appShell.hidden = false;
  applyNavLabels();
  await render();
}

boot();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
