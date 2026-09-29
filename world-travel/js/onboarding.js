import { setLang, getLang, t } from './i18n.js';
import { savePrefs } from './prefs.js';

async function loadInterests() {
  const res = await fetch('data/interests.json');
  return res.json();
}

function renderLangStep(root, onNext) {
  root.innerHTML = `
    <div class="onboard-step onboard-step--lang">
      <img class="onboard-step__logo" src="assets/icons/icon-192.png" alt="" />
      <h1 class="onboard-step__title">Shiori's World Travel</h1>
      <div class="onboard-lang-buttons">
        <button type="button" class="btn btn-primary btn-block" data-lang="ja">日本語</button>
        <button type="button" class="btn btn-outline btn-block" data-lang="en">English</button>
      </div>
    </div>
  `;
  root.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const lang = btn.dataset.lang;
      setLang(lang);
      await savePrefs({ language: lang });
      onNext();
    });
  });
}

async function renderInterestsStep(root, onComplete) {
  const interests = await loadInterests();
  const lang = getLang();
  const selected = new Set();

  root.innerHTML = `
    <div class="onboard-step">
      <h1 class="onboard-step__title">${t('onboardInterestsTitle')}</h1>
      <p class="onboard-step__subtitle">${t('onboardInterestsSubtitle')}</p>
      <div class="interest-grid" data-role="grid"></div>
      <button type="button" class="btn btn-primary btn-block onboard-step__cta" data-role="continue" disabled>${t('onboardStart')}</button>
    </div>
  `;
  const grid = root.querySelector('[data-role="grid"]');
  const continueBtn = root.querySelector('[data-role="continue"]');

  for (const interest of interests) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'interest-chip';
    chip.textContent = lang === 'ja' ? interest.ja : interest.en;
    chip.addEventListener('click', () => {
      if (selected.has(interest.id)) {
        selected.delete(interest.id);
        chip.classList.remove('is-selected');
      } else {
        selected.add(interest.id);
        chip.classList.add('is-selected');
      }
      continueBtn.disabled = selected.size === 0;
    });
    grid.appendChild(chip);
  }

  continueBtn.addEventListener('click', async () => {
    await savePrefs({ interests: [...selected], onboarded: true });
    onComplete();
  });
}

export function renderOnboarding(root, onComplete) {
  renderLangStep(root, () => renderInterestsStep(root, onComplete));
}
