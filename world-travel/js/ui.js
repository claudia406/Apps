import { t } from './i18n.js';

const modalRoot = () => document.getElementById('modal-root');

export function openModal(contentEl, { dismissible = true, onDismiss } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.appendChild(contentEl);
  modalRoot().appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-open'));

  function close() {
    overlay.classList.remove('is-open');
    setTimeout(() => overlay.remove(), 200);
  }

  if (dismissible) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
        onDismiss?.();
      }
    });
  }

  return { close, overlay };
}

export function confirmDialog({ title, body, confirmLabel, cancelLabel, danger = false }) {
  return new Promise((resolve) => {
    const card = document.createElement('div');
    card.className = 'dialog-card';
    card.innerHTML = `
      <p class="dialog-title"></p>
      <p class="dialog-body"></p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-ghost" data-action="cancel"></button>
        <button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm"></button>
      </div>
    `;
    card.querySelector('.dialog-title').textContent = title;
    card.querySelector('.dialog-body').textContent = body;
    card.querySelector('[data-action="cancel"]').textContent = cancelLabel ?? t('cancel');
    card.querySelector('[data-action="confirm"]').textContent = confirmLabel ?? t('ok');

    const { close } = openModal(card, { dismissible: true, onDismiss: () => resolve(false) });

    card.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      close();
      resolve(false);
    });
    card.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      close();
      resolve(true);
    });
  });
}

export function alertDialog({ title, body }) {
  return new Promise((resolve) => {
    const card = document.createElement('div');
    card.className = 'dialog-card';
    card.innerHTML = `
      <p class="dialog-title"></p>
      <p class="dialog-body"></p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-action="ok"></button>
      </div>
    `;
    card.querySelector('.dialog-title').textContent = title;
    card.querySelector('.dialog-body').textContent = body;
    card.querySelector('[data-action="ok"]').textContent = t('ok');

    const { close } = openModal(card, { dismissible: true, onDismiss: () => resolve() });
    card.querySelector('[data-action="ok"]').addEventListener('click', () => {
      close();
      resolve();
    });
  });
}

export function openSheet(contentEl, opts = {}) {
  contentEl.classList.add('sheet');
  return openModal(contentEl, opts);
}
