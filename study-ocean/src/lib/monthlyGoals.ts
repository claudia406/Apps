import { createAdminClient } from "@/lib/supabase/admin";

export async function getMonthlyGoal(yearMonth: string): Promise<number | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("monthly_goals")
    .select("goal_minutes")
    .eq("year_month", yearMonth)
    .maybeSingle();

  if (error) throw new Error(`目標の取得に失敗しました: ${error.message}`);
  return data?.goal_minutes ?? null;
}

export async function setMonthlyGoal(yearMonth: string, goalMinutes: number | null): Promise<void> {
  const supabase = createAdminClient();

  if (goalMinutes === null) {
    const { error } = await supabase.from("monthly_goals").delete().eq("year_month", yearMonth);
    if (error) throw new Error(`目標の削除に失敗しました: ${error.message}`);
    return;
  }

  const { error } = await supabase
    .from("monthly_goals")
    .upsert(
      { year_month: yearMonth, goal_minutes: goalMinutes, updated_at: new Date().toISOString() },
      { onConflict: "year_month" }
    );
  if (error) throw new Error(`目標の保存に失敗しました: ${error.message}`);
}
