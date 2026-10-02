// 無操作による自動ログアウトまでの時間(ミリ秒)
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30分

// ログイン失敗のロックアウト設定
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_WINDOW_MINUTES = 15;

// ラベル用紙 F21A4-2 (A4 / 21面 / 3列×7行 / 70mm×42.3mm)
export const LABEL_SHEET = {
  pageWidthMm: 210,
  pageHeightMm: 297,
  columns: 3,
  rows: 7,
  labelWidthMm: 70,
  labelHeightMm: 42.3,
} as const;

export const LABEL_COUNT = LABEL_SHEET.columns * LABEL_SHEET.rows;
