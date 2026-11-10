import type { DateStr } from "@/lib/date";
import { addDays, compareDateStr, dateRange } from "@/lib/date";
import { DEGEN_TOTAL_DAYS, FINAL_FORM_STREAK_DAYS } from "@/lib/constants";
import { UNLOCKS } from "@/lib/oceanContent";
import type { OceanState } from "@/lib/types";

export interface EvaluatedDayResult {
  date: DateStr;
  state: OceanState;
  newlyUnlockedIds: string[];
}

/**
 * ある1日の達成/未達成を踏まえて海の状態を1日分進める純粋関数。
 *
 * 退化カーブ: 未達成が続いた日数(missStreak)に応じて、
 *   health = round(healthAtDegenStart * max(0, DEGEN_TOTAL_DAYS - missStreak) / (DEGEN_TOTAL_DAYS - 1))
 * missStreak=1 → ほぼ変化なし、missStreak=DEGEN_TOTAL_DAYS(7) → 0(枯れた状態) になる。
 *
 * 回復は成長と同じ速度（1達成日ごとに health +1）で進む。
 * 過去記録の編集はこの関数の外側（呼び出し側）で再実行されることがないよう、
 * 呼び出し側は lastEvaluatedDate より先の未評価日だけをこの関数に渡すこと。
 */
export function evaluateDay(prev: OceanState, date: DateStr, achieved: boolean): EvaluatedDayResult {
  const next: OceanState = { ...prev, unlocked: [...prev.unlocked] };
  const newlyUnlockedIds: string[] = [];

  if (achieved) {
    next.missStreak = 0;
    next.streakCurrent = prev.streakCurrent + 1;
    next.streakBest = Math.max(prev.streakBest, next.streakCurrent);
    next.totalAchievedDays = prev.totalAchievedDays + 1;
    next.health = Math.min(60, prev.health + 1);

    if (next.streakCurrent >= FINAL_FORM_STREAK_DAYS) {
      next.finalFormReached = true;
    }

    for (const unlock of UNLOCKS) {
      if (unlock.streakDays === next.streakCurrent && !prev.unlocked.some((u) => u.id === unlock.id)) {
        next.unlocked.push({ id: unlock.id, unlockedAt: date });
        newlyUnlockedIds.push(unlock.id);
      }
    }

    const wasUnhealthy =
      prev.phase === "degenerating" || prev.phase === "dormant" || prev.phase === "recovering";
    if (wasUnhealthy && next.health < prev.healthAtDegenStart) {
      next.phase = "recovering";
      // healthAtDegenStart（回復の目標値）はそのまま維持する
    } else {
      next.phase = "growing";
      next.healthAtDegenStart = next.health;
    }
  } else {
    if (prev.phase === "growing") {
      // 退化が始まった時点の health を回復の目標値として固定する
      next.healthAtDegenStart = prev.health;
    }
    next.missStreak = prev.missStreak + 1;
    next.streakCurrent = 0;

    const span = DEGEN_TOTAL_DAYS - 1; // 6
    const remaining = Math.max(0, DEGEN_TOTAL_DAYS - next.missStreak);
    next.health = Math.round((next.healthAtDegenStart * remaining) / span);

    next.phase = next.health <= 0 ? "dormant" : "degenerating";
  }

  next.lastEvaluatedDate = date;
  return { date, state: next, newlyUnlockedIds };
}

/**
 * state.lastEvaluatedDate の翌日から upToDateInclusive までを順に評価する。
 * achievedOn(date) は、その日の合計学習分数が DAILY_GOAL_MINUTES 以上かどうかを返す関数。
 */
export function advanceOceanState(
  state: OceanState,
  upToDateInclusive: DateStr,
  achievedOn: (date: DateStr) => boolean
): { state: OceanState; newlyUnlockedIds: string[] } {
  let cur = state;
  const allNewlyUnlocked: string[] = [];

  const from = state.lastEvaluatedDate ? addDays(state.lastEvaluatedDate, 1) : upToDateInclusive;
  if (compareDateStr(from, upToDateInclusive) > 0) {
    return { state: cur, newlyUnlockedIds: [] };
  }

  for (const date of dateRange(from, upToDateInclusive)) {
    const result = evaluateDay(cur, date, achievedOn(date));
    cur = result.state;
    allNewlyUnlocked.push(...result.newlyUnlockedIds);
  }

  return { state: cur, newlyUnlockedIds: allNewlyUnlocked };
}
