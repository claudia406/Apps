import { setLang, getLang, t } from './i18n.js';
import { savePrefs } from './prefs.js';

export function renderSettings(container, { onLanguageChanged } = {}) {
  const lang = getLang();
  container.innerHTML = `
    <div class="screen-header"><h1>${t('settingsTitle')}</h1></div>
    <div class="settings-section">
      <label class="field-label">${t('settingsLanguage')}</label>
      <div class="settings-lang-toggle">
        <button type="button" class="settings-lang-btn ${lang === 'ja' ? 'is-active' : ''}" data-lang="ja">${t('settingsLangJa')}</button>
        <button type="button" class="settings-lang-btn ${lang === 'en' ? 'is-active' : ''}" data-lang="en">${t('settingsLangEn')}</button>
      </div>
    </div>
  `;

  container.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const newLang = btn.dataset.lang;
      if (newLang === getLang()) return;
      setLang(newLang);
      await savePrefs({ language: newLang });
      onLanguageChanged?.();
    });
  });
}
