'use strict';

// ── Countdown ──────────────────────────────────────────────
function updateCountdown() {
  const el = document.getElementById('countdown-days');
  if (!el) return;

  const departure = new Date('2026-09-19T18:40:00+09:00');
  const tripStart  = new Date('2026-09-20T00:00:00+08:00');
  const tripEnd    = new Date('2026-09-27T01:30:00+08:00');
  const now = new Date();
  const statusEl   = document.getElementById('trip-status');
  const todayBlock = document.getElementById('today-plan');
  const todayLink  = document.getElementById('today-plan-link');

  if (now < departure) {
    const days = Math.ceil((departure - now) / 86400000);
    el.textContent = days;
    if (days <= 3 && statusEl) {
      statusEl.textContent = '🎉 もうすぐ出発！ワクワクが止まらない！';
      statusEl.style.display = 'block';
    }
  } else if (now >= tripStart && now < tripEnd) {
    const dayNum = Math.floor((now - tripStart) / 86400000) + 1;
    el.textContent = '🌟';
    el.style.fontSize = '56px';
    if (statusEl) {
      statusEl.textContent = `シンガポール旅行 Day ${Math.min(dayNum, 7)}！楽しんで！`;
      statusEl.style.display = 'block';
    }
    if (todayBlock && todayLink && dayNum <= 7) {
      todayBlock.style.display = 'block';
      todayLink.href = `day${dayNum}.html`;
      todayLink.innerHTML = `📅 今日 Day ${dayNum} のプランを見る →`;
    }
  } else if (now >= tripEnd) {
    el.textContent = '🥳';
    el.style.fontSize = '56px';
    if (statusEl) {
      statusEl.textContent = '旅行お疲れさまでした！最高の思い出ができたね 💕';
      statusEl.style.display = 'block';
    }
  }
}

// ── Checklist (localStorage) ───────────────────────────────
function initChecklist() {
  document.querySelectorAll('.checklist-checkbox').forEach((cb, i) => {
    const key = `chk-${location.pathname}-${i}`;
    const text = cb.nextElementSibling;

    const restore = (v) => {
      if (v) {
        cb.classList.add('checked');
        cb.innerHTML = '✓';
        text && text.classList.add('checked-text');
      }
    };
    restore(localStorage.getItem(key));

    cb.addEventListener('click', () => {
      const on = cb.classList.toggle('checked');
      cb.innerHTML = on ? '✓' : '';
      text && text.classList.toggle('checked-text', on);
      localStorage.setItem(key, on ? '1' : '');
    });
  });
}

// ── Active nav item ────────────────────────────────────────
function setActiveNav() {
  const file = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('active', href === file);
  });
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  initChecklist();
  setActiveNav();
});

// ── Service Worker ─────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
