"use client";

import { useEffect, useMemo, useState } from "react";
import StatTile from "@/components/StatTile";
import StatsBarChart from "@/components/StatsBarChart";
import { useFullStats } from "@/hooks/useFullStats";
import { useOceanState } from "@/hooks/useOceanState";
import { buildCalendarWeeks, WEEKDAY_HEADERS } from "@/lib/calendarGrid";
import { DAILY_GOAL_MINUTES } from "@/lib/constants";
import { formatHoursDecimal, formatMinutes, todayJST, type DateStr } from "@/lib/date";

type Tab = "week" | "month" | "all";

const TAB_LABEL: Record<Tab, string> = { week: "週", month: "月", all: "累計" };

export default function StatsPage() {
  const { data: stats, loading, error, refresh } = useFullStats();
  const { data: oceanData } = useOceanState();
  const [tab, setTab] = useState<Tab>("week");
  const [goalMinutes, setGoalMinutes] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/goal")
      .then((r) => r.json())
      .then((j) => setGoalMinutes(j.goalMinutes ?? null))
      .catch(() => {});
  }, []);

  const minutesByDate = useMemo(() => {
    const map = new Map<DateStr, number>();
    if (stats) for (const d of stats.monthlyByDay) map.set(d.date, d.minutes);
    return map;
  }, [stats]);

  const weeks = useMemo(
    () => (stats ? buildCalendarWeeks(todayJST().slice(0, 7), minutesByDate) : []),
    [stats, minutesByDate]
  );

  if (loading || !stats) {
    return (
      <div className="px-5 sm:px-8 pt-2 sm:pt-8 pb-6 max-w-2xl mx-auto">
        <h1 className="text-[20px] font-extrabold text-text mb-4">Stats</h1>
        {error ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-text-muted">{error}</p>
            <button onClick={() => refresh()} className="text-accent text-sm font-bold underline underline-offset-2">
              もう一度読み込む
            </button>
          </div>
        ) : (
          <p className="text-sm text-text-faint">読み込み中...</p>
        )}
      </div>
    );
  }

  const active = tab === "week" ? stats.week : tab === "month" ? stats.month : stats.allTime;
  const monthGoalProgress = goalMinutes ? Math.min(1, stats.month.totalMinutes / goalMinutes) : null;

  return (
    <div className="px-5 sm:px-8 pt-2 sm:pt-8 pb-6 max-w-2xl mx-auto">
      <h1 className="text-[20px] font-extrabold text-text mb-4">Stats</h1>

      <div className="inline-flex rounded-full bg-surface-soft p-1 mb-4">
        {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-[13px] font-bold transition-colors ${
              tab === t ? "bg-surface text-accent shadow-sm" : "text-text-muted"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatTile label={`${TAB_LABEL[tab]}の合計時間`} value={formatMinutes(active.totalMinutes)} emphasis />
        <StatTile label={`${TAB_LABEL[tab]}の達成日数`} value={`${active.achievedDays}日`} />
        <StatTile label="現在の連続記録" value={`${oceanData?.state.streakCurrent ?? "—"}日`} />
        <StatTile label="過去最高の連続記録" value={`${oceanData?.state.streakBest ?? "—"}日`} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-2.5">
        <StatTile
          label="1日平均"
          value={formatMinutes(Math.round(active.avgMinutesPerCalendarDay))}
          sub="暦日あたり"
        />
        <StatTile
          label="勉強した日の平均"
          value={formatMinutes(Math.round(active.avgMinutesPerStudiedDay))}
        />
        <StatTile label="1日の最高記録" value={formatMinutes(active.maxMinutesInDay)} />
        <StatTile label="今日" value={formatMinutes(stats.today)} />
      </div>

      {goalMinutes && (
        <section className="mt-6 rounded-2xl bg-surface border border-border px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-bold text-text-muted">今月の目標達成率</p>
            <p className="text-[13px] font-bold text-accent">{Math.round((monthGoalProgress ?? 0) * 100)}%</p>
          </div>
          <div className="h-2.5 rounded-full bg-surface-soft overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-700"
              style={{ width: `${(monthGoalProgress ?? 0) * 100}%` }}
            />
          </div>
          <p className="text-[12px] text-text-faint mt-2">
            {formatMinutes(stats.month.totalMinutes)} / {formatMinutes(goalMinutes)}
            {stats.month.totalMinutes < goalMinutes && (
              <> （残り {formatMinutes(goalMinutes - stats.month.totalMinutes)}）</>
            )}
          </p>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-[15px] font-bold text-text mb-2">月別勉強時間</h2>
        <div className="rounded-2xl bg-surface border border-border px-4 py-4">
          <StatsBarChart data={stats.monthlyTotals.slice(-12)} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-[15px] font-bold text-text mb-2">今月のカレンダー</h2>
        <div className="rounded-2xl bg-surface border border-border p-3">
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-[10.5px] font-medium text-text-faint py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map((cell, i) => {
              if (!cell) return <div key={i} />;
              const intensity = Math.min(1, cell.minutes / 180);
              const achieved = cell.minutes >= DAILY_GOAL_MINUTES;
              return (
                <div
                  key={cell.date}
                  className="aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium"
                  style={{
                    background: cell.minutes > 0 ? `color-mix(in srgb, var(--ramp-4) ${30 + intensity * 70}%, var(--surface))` : "var(--surface-soft)",
                    color: achieved ? "#fff" : "var(--text-muted)",
                  }}
                  title={`${cell.date}: ${formatMinutes(cell.minutes)}`}
                >
                  {cell.day}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <p className="text-[11px] text-text-faint mt-5 text-center">
        累計 {formatHoursDecimal(stats.allTime.totalMinutes)} 時間・達成 {stats.allTime.achievedDays}日
      </p>
    </div>
  );
}
