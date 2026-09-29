import { getDiscoverSelections } from './discover.js';
import { openSheet } from './ui.js';
import { t, getLang } from './i18n.js';

function formatDate(ts, lang) {
  const d = new Date(ts);
  return d.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function openDetailSheet(item, lang) {
  const name = lang === 'ja' ? item.nameJa : item.nameEn;
  const why = lang === 'ja' ? item.why.ja : item.why.en;
  const highlights = lang === 'ja' ? item.highlights.ja : item.highlights.en;

  const wrap = document.createElement('div');
  wrap.className = 'sheet sheet--full discover-detail';
  wrap.innerHTML = `
    <div class="sheet__header">
      <h2>${item.flag} ${name}</h2>
      <button type="button" class="sheet__close">✕</button>
    </div>
    <div class="sheet__body">
      ${item.photo ? `<div class="discover-detail__photo" style="background-image:url('${item.photo}')"></div>` : ''}
      <h3 class="discover-detail__heading">${t('discoverWhy')}</h3>
      <p class="discover-detail__why">${why}</p>
      <h3 class="discover-detail__heading">${t('discoverHighlights')}</h3>
      <ul class="discover-detail__list">
        ${highlights.map((h) => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `;
  const handle = openSheet(wrap);
  wrap.querySelector('.sheet__close').addEventListener('click', () => handle.close());
}

export async function renderDiscover(container) {
  const lang = getLang();
  container.innerHTML = `
    <div class="screen-header">
      <h1>${t('discoverTitle')}</h1>
      <p class="screen-header__subtitle">${t('discoverSubtitle')}</p>
    </div>
    <div data-role="body" class="discover-body">
      <p class="discover-loading">${t('discoverLoading')}</p>
    </div>
  `;

  const body = container.querySelector('[data-role="body"]');
  const result = await getDiscoverSelections();

  if (!result.items) {
    body.innerHTML = `
      <div class="empty-state">
        <p>${result.offline ? t('discoverOffline') : t('discoverError')}</p>
        <button type="button" class="btn btn-outline" data-role="retry">${t('discoverOfflineRetry')}</button>
      </div>
    `;
    body.querySelector('[data-role="retry"]').addEventListener('click', () => renderDiscover(container));
    return;
  }

  body.innerHTML = `
    ${result.stale ? `<p class="discover-note">${t('discoverStale')}</p>` : ''}
    <p class="discover-note">${t('discoverRefreshedAt', { date: formatDate(result.refreshedAt, lang) })}</p>
    <div class="discover-cards" data-role="cards"></div>
  `;
  const cardsEl = body.querySelector('[data-role="cards"]');

  for (const item of result.items) {
    const name = lang === 'ja' ? item.nameJa : item.nameEn;
    const why = lang === 'ja' ? item.why.ja : item.why.en;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'discover-card';
    card.innerHTML = `
      ${item.photo
        ? `<div class="discover-card__photo" style="background-image:url('${item.photo}')"></div>`
        : `<div class="discover-card__photo discover-card__photo--empty"><span>${item.flag}</span></div>`}
      <div class="discover-card__body">
        <h2 class="discover-card__name">${item.flag} ${name}</h2>
        <p class="discover-card__why">${why}</p>
      </div>
    `;
    card.addEventListener('click', () => openDetailSheet(item, lang));
    cardsEl.appendChild(card);
  }
}
