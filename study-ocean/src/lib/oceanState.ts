import { createAdminClient } from "@/lib/supabase/admin";
import { addDays, todayJST, type DateStr } from "@/lib/date";
import { DAILY_GOAL_MINUTES } from "@/lib/constants";
import { advanceOceanState } from "@/lib/oceanEngine";
import { createInitialOceanState, type OceanPhase, type OceanState, type UnlockedEntry } from "@/lib/types";

interface DbOceanState {
  last_evaluated_date: DateStr | null;
  health: number;
  streak_current: number;
  streak_best: number;
  miss_streak: number;
  health_at_degen_start: number;
  total_achieved_days: number;
  final_form_reached: boolean;
  unlocked: UnlockedEntry[];
  phase: OceanPhase;
}

function fromDb(row: DbOceanState): OceanState {
  return {
    lastEvaluatedDate: row.last_evaluated_date,
    health: row.health,
    streakCurrent: row.streak_current,
    streakBest: row.streak_best,
    missStreak: row.miss_streak,
    healthAtDegenStart: row.health_at_degen_start,
    totalAchievedDays: row.total_achieved_days,
    finalFormReached: row.final_form_reached,
    unlocked: row.unlocked ?? [],
    phase: row.phase,
  };
}

function toDb(state: OceanState) {
  return {
    id: 1,
    last_evaluated_date: state.lastEvaluatedDate,
    health: state.health,
    streak_current: state.streakCurrent,
    streak_best: state.streakBest,
    miss_streak: state.missStreak,
    health_at_degen_start: state.healthAtDegenStart,
    total_achieved_days: state.totalAchievedDays,
    final_form_reached: state.finalFormReached,
    unlocked: state.unlocked,
    phase: state.phase,
    updated_at: new Date().toISOString(),
  };
}

async function fetchRaw(): Promise<OceanState> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("ocean_state").select("*").eq("id", 1).maybeSingle();

  if (error) throw new Error(`海の状態の取得に失敗しました: ${error.message}`);
  if (!data) return createInitialOceanState();
  return fromDb(data as DbOceanState);
}

/**
 * 海の状態を「評価済みの最後の日付の翌日」から「今日の前日(JST)」まで進め、DBに保存して返す。
 * 今日の記録はまだ確定していないため評価しない（翌日にその結果が反映される）。
 * 過去日の記録を後から編集しても、すでに評価済みの日の health/streak は再計算されない。
 */
export async function getCurrentOceanState(): Promise<{ state: OceanState; newlyUnlockedIds: string[] }> {
  const supabase = createAdminClient();
  let state = await fetchRaw();

  const yesterday = addDays(todayJST(), -1);

  if (state.lastEvaluatedDate === null) {
    // 初回利用: バックフィルは行わず、今日より前の評価対象なしとして開始する
    state = { ...state, lastEvaluatedDate: yesterday };
    const { error } = await supabase.from("ocean_state").upsert(toDb(state), { onConflict: "id" });
    if (error) throw new Error(`海の状態の初期化に失敗しました: ${error.message}`);
    return { state, newlyUnlockedIds: [] };
  }

  if (state.lastEvaluatedDate >= yesterday) {
    return { state, newlyUnlockedIds: [] };
  }

  const { data: records, error: recordsError } = await supabase
    .from("study_records")
    .select("record_date, minutes")
    .gt("record_date", state.lastEvaluatedDate)
    .lte("record_date", yesterday);

  if (recordsError) throw new Error(`学習記録の取得に失敗しました: ${recordsError.message}`);

  const minutesByDate = new Map<DateStr, number>();
  for (const row of (records ?? []) as { record_date: DateStr; minutes: number }[]) {
    minutesByDate.set(row.record_date, row.minutes);
  }

  const { state: advanced, newlyUnlockedIds } = advanceOceanState(state, yesterday, (date) => {
    return (minutesByDate.get(date) ?? 0) >= DAILY_GOAL_MINUTES;
  });

  const { error: saveError } = await supabase.from("ocean_state").upsert(toDb(advanced), { onConflict: "id" });
  if (saveError) throw new Error(`海の状態の保存に失敗しました: ${saveError.message}`);

  return { state: advanced, newlyUnlockedIds };
}
