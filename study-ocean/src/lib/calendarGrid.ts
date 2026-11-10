import { daysInMonth, startOfMonth, addDays, weekdayMondayFirst, type DateStr } from "@/lib/date";

export interface CalendarCell {
  date: DateStr;
  day: number;
  minutes: number;
}

/** 月曜始まりの週ごとの配列を作る。月の前後は null で埋める。 */
export function buildCalendarWeeks(yearMonth: string, minutesByDate: Map<DateStr, number>): (CalendarCell | null)[][] {
  const start = startOfMonth(yearMonth);
  const total = daysInMonth(yearMonth);
  const leading = weekdayMondayFirst(start);

  const cells: (CalendarCell | null)[] = Array.from({ length: leading }, () => null);
  for (let i = 0; i < total; i++) {
    const date = addDays(start, i);
    cells.push({ date, day: i + 1, minutes: minutesByDate.get(date) ?? 0 });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (CalendarCell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export const WEEKDAY_HEADERS = ["月", "火", "水", "木", "金", "土", "日"];

export function shiftYearMonth(yearMonth: string, delta: number): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
