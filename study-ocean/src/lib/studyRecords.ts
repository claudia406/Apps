import { createAdminClient } from "@/lib/supabase/admin";
import type { DateStr } from "@/lib/date";
import { addDays, startOfMonth, startOfWeek, todayJST, daysInMonth, yearMonthOf } from "@/lib/date";
import { DAILY_GOAL_MINUTES } from "@/lib/constants";

export interface DbStudyRecord {
  record_date: DateStr;
  minutes: number;
}

async function fetchRange(from: DateStr, to: DateStr): Promise<Map<DateStr, number>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("study_records")
    .select("record_date, minutes")
    .gte("record_date", from)
    .lte("record_date", to);

  if (error) throw new Error(`学習記録の取得に失敗しました: ${error.message}`);

  const map = new Map<DateStr, number>();
  for (const row of (data ?? []) as DbStudyRecord[]) {
    map.set(row.record_date, row.minutes);
  }
  return map;
}

export async function getRecord(date: DateStr): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("study_records")
    .select("minutes")
    .eq("record_date", date)
    .maybeSingle();

  if (error) throw new Error(`学習記録の取得に失敗しました: ${error.message}`);
  return data?.minutes ?? 0;
}

/** 当日の学習時間に加算する（クイック追加ボタン用）。同じ日の複数回登録は合算される。 */
export async function addMinutesToDate(date: DateStr, deltaMinutes: number): Promise<number> {
  const supabase = createAdminClient();
  const current = await getRecord(date);
  const next = current + deltaMinutes;

  const { error } = await supabase
    .from("study_records")
    .upsert(
      { record_date: date, minutes: next, updated_at: new Date().toISOString() },
      { onConflict: "record_date" }
    );

  if (error) throw new Error(`学習記録の保存に失敗しました: ${error.message}`);
  return next;
}

/** 指定日の合計学習時間を置き換える（編集UI用）。 */
export async function setMinutesForDate(date: DateStr, totalMinutes: number): Promise<number> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("study_records")
    .upsert(
      { record_date: date, minutes: totalMinutes, updated_at: new Date().toISOString() },
      { onConflict: "record_date" }
    );

  if (error) throw new Error(`学習記録の保存に失敗しました: ${error.message}`);
  return totalMinutes;
}

export function isAchieved(minutes: number): boolean {
  return minutes >= DAILY_GOAL_MINUTES;
}

export interface StatsSummary {
  totalMinutes: number;
  achievedDays: number;
  daysWithRecord: number;
  avgMinutesPerCalendarDay: number;
  avgMinutesPerStudiedDay: number;
  maxMinutesInDay: number;
}

function summarize(entries: number[], calendarDayCount: number): StatsSummary {
  const totalMinutes = entries.reduce((a, b) => a + b, 0);
  const achievedDays = entries.filter((m) => isAchieved(m)).length;
  const daysWithRecord = entries.filter((m) => m > 0).length;
  const maxMinutesInDay = entries.length > 0 ? Math.max(...entries, 0) : 0;
  return {
    totalMinutes,
    achievedDays,
    daysWithRecord,
    avgMinutesPerCalendarDay: calendarDayCount > 0 ? totalMinutes / calendarDayCount : 0,
    avgMinutesPerStudiedDay: daysWithRecord > 0 ? totalMinutes / daysWithRecord : 0,
    maxMinutesInDay,
  };
}

export interface FullStats {
  today: number;
  week: StatsSummary;
  month: StatsSummary;
  allTime: StatsSummary;
  monthlyByDay: { date: DateStr; minutes: number }[];
  monthlyTotals: { yearMonth: string; minutes: number }[];
}

export async function getFullStats(referenceDate: DateStr = todayJST()): Promise<FullStats> {
  const weekStart = startOfWeek(referenceDate);
  const monthStart = startOfMonth(yearMonthOf(referenceDate));
  const earliestBound = "2000-01-01";

  const [weekMap, monthMap, allMap] = await Promise.all([
    fetchRange(weekStart, referenceDate),
    fetchRange(monthStart, referenceDate),
    fetchRange(earliestBound, referenceDate),
  ]);

  const today = allMap.get(referenceDate) ?? 0;

  const weekEntries = Array.from({ length: 7 }, (_, i) => weekMap.get(addDays(weekStart, i)) ?? 0).filter(
    (_, i) => addDays(weekStart, i) <= referenceDate
  );

  const monthDayCount = daysInMonthSoFar(monthStart, referenceDate);
  const monthEntries: number[] = [];
  for (let i = 0; i < monthDayCount; i++) {
    monthEntries.push(monthMap.get(addDays(monthStart, i)) ?? 0);
  }

  const allEntries = Array.from(allMap.values());
  const allTimeDayCount = allMap.size > 0 ? dayCountBetween(earliestFirstRecordDate(allMap) ?? referenceDate, referenceDate) : 0;

  const yearMonthsSet = new Set<string>();
  for (const d of allMap.keys()) yearMonthsSet.add(yearMonthOf(d));
  const monthlyTotals = Array.from(yearMonthsSet)
    .sort()
    .map((ym) => ({
      yearMonth: ym,
      minutes: Array.from(allMap.entries())
        .filter(([d]) => yearMonthOf(d) === ym)
        .reduce((sum, [, m]) => sum + m, 0),
    }));

  const monthlyByDay = Array.from({ length: monthDayCount }, (_, i) => {
    const date = addDays(monthStart, i);
    return { date, minutes: monthMap.get(date) ?? 0 };
  });

  return {
    today,
    week: summarize(weekEntries, weekEntries.length),
    month: summarize(monthEntries, monthEntries.length),
    allTime: summarize(allEntries, Math.max(allTimeDayCount, allEntries.length)),
    monthlyByDay,
    monthlyTotals,
  };
}

function daysInMonthSoFar(monthStart: DateStr, referenceDate: DateStr): number {
  const ym = yearMonthOf(monthStart);
  const totalDays = daysInMonth(ym);
  if (yearMonthOf(referenceDate) !== ym) return totalDays;
  const dayOfMonth = Number(referenceDate.slice(8, 10));
  return Math.min(dayOfMonth, totalDays);
}

function dayCountBetween(from: DateStr, to: DateStr): number {
  const fromMs = new Date(`${from}T00:00:00Z`).getTime();
  const toMs = new Date(`${to}T00:00:00Z`).getTime();
  return Math.round((toMs - fromMs) / 86400000) + 1;
}

function earliestFirstRecordDate(map: Map<DateStr, number>): DateStr | null {
  const keys = Array.from(map.keys()).sort();
  return keys.length > 0 ? keys[0] : null;
}

export async function listMonthRecords(yearMonth: string): Promise<Map<DateStr, number>> {
  const from = startOfMonth(yearMonth);
  const to = addDays(startOfMonth(yearMonth), daysInMonth(yearMonth) - 1);
  return fetchRange(from, to);
}

export async function getAllRecordsSorted(): Promise<DbStudyRecord[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("study_records")
    .select("record_date, minutes")
    .order("record_date", { ascending: true });

  if (error) throw new Error(`学習記録の取得に失敗しました: ${error.message}`);
  return (data ?? []) as DbStudyRecord[];
}
