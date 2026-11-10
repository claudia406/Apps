const JST_TIME_ZONE = "Asia/Tokyo";

const jstFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: JST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 'YYYY-MM-DD' (日本時間) */
export type DateStr = string;

/** 現在の日本時間での日付文字列を返す */
export function todayJST(): DateStr {
  return jstFormatter.format(new Date());
}

/** Date オブジェクトを日本時間基準の 'YYYY-MM-DD' に変換する */
export function toJSTDateString(d: Date): DateStr {
  return jstFormatter.format(d);
}

/** 'YYYY-MM-DD' を日付計算用の UTC 正午の Date にする（タイムゾーンのズレでの日付ズレを防ぐ） */
export function parseDateStr(dateStr: DateStr): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

export function formatDateStr(date: Date): DateStr {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: DateStr, days: number): DateStr {
  const d = parseDateStr(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDateStr(d);
}

export function compareDateStr(a: DateStr, b: DateStr): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isFutureJST(dateStr: DateStr): boolean {
  return compareDateStr(dateStr, todayJST()) > 0;
}

/** 0=月曜 ... 6=日曜 */
export function weekdayMondayFirst(dateStr: DateStr): number {
  const jsDay = parseDateStr(dateStr).getUTCDay(); // 0=日曜
  return (jsDay + 6) % 7;
}

/** その日を含む週の月曜日 */
export function startOfWeek(dateStr: DateStr): DateStr {
  return addDays(dateStr, -weekdayMondayFirst(dateStr));
}

/** 'YYYY-MM' */
export function yearMonthOf(dateStr: DateStr): string {
  return dateStr.slice(0, 7);
}

export function startOfMonth(yearMonth: string): DateStr {
  return `${yearMonth}-01`;
}

export function daysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function startOfYear(dateStr: DateStr): DateStr {
  return `${dateStr.slice(0, 4)}-01-01`;
}

/** [from, to] の日付文字列を順に列挙する（to を含む） */
export function* dateRange(from: DateStr, to: DateStr): Generator<DateStr> {
  let cur = from;
  while (compareDateStr(cur, to) <= 0) {
    yield cur;
    cur = addDays(cur, 1);
  }
}

const weekdayLabels = ["月", "火", "水", "木", "金", "土", "日"];
export function weekdayLabelJa(dateStr: DateStr): string {
  return weekdayLabels[weekdayMondayFirst(dateStr)];
}

/** 分を「2時間30分」のような表示にする */
export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "0分";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}

/** 128.5 時間のような小数表示（統計用） */
export function formatHoursDecimal(minutes: number): string {
  return (minutes / 60).toFixed(1);
}
