"use client";

import { useCallback, useEffect, useState } from "react";
import EditDaySheet from "@/components/EditDaySheet";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { buildCalendarWeeks, shiftYearMonth, WEEKDAY_HEADERS } from "@/lib/calendarGrid";
import { DAILY_GOAL_MINUTES } from "@/lib/constants";
import { todayJST, yearMonthOf, type DateStr } from "@/lib/date";
import { useToast } from "@/components/Toast";

export default function JournalPage() {
  const currentYearMonth = yearMonthOf(todayJST());
  const [yearMonth, setYearMonth] = useState(currentYearMonth);
  const [minutesByDate, setMinutesByDate] = useState<Map<DateStr, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateStr | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const toast = useToast();

  const load = useCallback(
    async (ym: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/records/month?ym=${ym}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "記録の取得に失敗しました");
        const map = new Map<DateStr, number>();
        for (const d of json.days as { date: DateStr; minutes: number }[]) map.set(d.date, d.minutes);
        setMinutesByDate(map);
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "記録の取得に失敗しました", "error");
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    // load() は内部で setState を行うため、effect本体から直接呼ばずマイクロタスクへ委譲する。
    queueMicrotask(() => {
      load(yearMonth);
    });
  }, [yearMonth, load]);

  const weeks = buildCalendarWeeks(yearMonth, minutesByDate);
  const today = todayJST();
  const isCurrentMonth = yearMonth === currentYearMonth;
  const achievedCount = Array.from(minutesByDate.values()).filter((m) => m >= DAILY_GOAL_MINUTES).length;

  function openDate(date: DateStr) {
    if (date > today) return;
    setSelectedDate(date);
    setEditOpen(true);
  }

  function handleSaved(date: DateStr, minutes: number) {
    setMinutesByDate((prev) => new Map(prev).set(date, minutes));
  }

  return (
    <div className="px-5 sm:px-8 pt-2 sm:pt-8 pb-6 max-w-2xl mx-auto">
      <h1 className="text-[20px] font-extrabold text-text mb-4">Journal</h1>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setYearMonth((ym) => shiftYearMonth(ym, -1))}
          aria-label="前の月"
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-soft transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <p className="text-[16px] font-bold text-text tabular-nums">
          {yearMonth.slice(0, 4)}年{Number(yearMonth.slice(5))}月
        </p>
        <button
          onClick={() => setYearMonth((ym) => shiftYearMonth(ym, 1))}
          disabled={isCurrentMonth}
          aria-label="次の月"
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-soft transition-colors disabled:opacity-25"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <p className="text-[13px] text-text-muted mb-3">
        この月の達成日数: <span className="font-bold text-accent">{achievedCount}日</span>
      </p>

      <div className="rounded-[24px] border border-border bg-surface p-3 sm:p-4">
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAY_HEADERS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-text-faint py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className={`grid grid-cols-7 gap-1 ${loading ? "opacity-40" : ""} transition-opacity`}>
          {weeks.flat().map((cell, i) => {
            if (!cell) return <div key={i} />;
            const achieved = cell.minutes >= DAILY_GOAL_MINUTES;
            const hasRecord = cell.minutes > 0;
            const isToday = cell.date === today;
            const isFuture = cell.date > today;
            return (
              <button
                key={cell.date}
                onClick={() => openDate(cell.date)}
                disabled={isFuture}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-[12px] font-medium transition-colors relative
                  ${isFuture ? "text-text-faint/50 cursor-default" : "text-text hover:bg-surface-soft active:scale-95"}
                  ${isToday ? "ring-2 ring-accent" : ""}
                `}
              >
                <span>{cell.day}</span>
                {!isFuture && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: achieved ? "var(--accent)" : hasRecord ? "var(--pale-blue)" : "transparent",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[12px] text-text-faint mt-3 px-1">日付をタップすると、その日の学習時間を追加・編集できます。</p>

      <EditDaySheet
        open={editOpen}
        date={selectedDate}
        initialMinutes={selectedDate ? minutesByDate.get(selectedDate) ?? 0 : 0}
        onClose={() => setEditOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}
