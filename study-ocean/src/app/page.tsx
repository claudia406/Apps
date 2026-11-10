"use client";

import { useEffect, useRef, useState } from "react";
import OceanScene from "@/components/ocean/OceanScene";
import QuickAddSheet from "@/components/QuickAddSheet";
import EditDaySheet from "@/components/EditDaySheet";
import { useOceanState } from "@/hooks/useOceanState";
import { useTodayRecord } from "@/hooks/useTodayRecord";
import { useFullStats } from "@/hooks/useFullStats";
import { useToast } from "@/components/Toast";
import { EditIcon, PlusIcon } from "@/components/icons";
import { formatMinutes, todayJST } from "@/lib/date";
import { QUICK_ADD_OPTIONS } from "@/lib/constants";
import { UNLOCKS } from "@/lib/oceanContent";

const PHASE_LABEL: Record<string, string> = {
  growing: "健やかに育っています",
  recovering: "ゆっくり回復しています",
  degenerating: "少し元気がなくなっています",
  dormant: "休眠中。再開を待っています",
};

export default function HomePage() {
  const { data: oceanData, loading: oceanLoading, error: oceanError, refresh: refreshOcean } = useOceanState();
  const { minutes: todayMinutes, loading: todayLoading, addMinutes, refresh: refreshToday } = useTodayRecord();
  const { data: stats, loading: statsLoading, refresh: refreshStats } = useFullStats();
  const toast = useToast();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [busyOption, setBusyOption] = useState<number | null>(null);
  const announcedRef = useRef(false);

  useEffect(() => {
    if (announcedRef.current) return;
    if (!oceanData || oceanData.newlyUnlockedIds.length === 0) return;
    announcedRef.current = true;
    for (const id of oceanData.newlyUnlockedIds) {
      const def = UNLOCKS.find((u) => u.id === id);
      if (def) toast.show(`新しい仲間が解放されました: ${def.name}`, "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oceanData]);

  async function handleQuickAdd(minutes: number) {
    setBusyOption(minutes);
    try {
      await addMinutes(minutes);
      toast.show(`${formatMinutes(minutes)}追加しました`, "success");
      refreshStats();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "保存に失敗しました", "error");
    } finally {
      setBusyOption(null);
    }
  }

  async function handleCustomAdd(minutes: number) {
    await addMinutes(minutes);
    refreshStats();
  }

  function handleEdited() {
    refreshToday();
    refreshStats();
  }

  const state = oceanData?.state;
  const totalMinutes = stats?.allTime.totalMinutes ?? 0;

  return (
    <div className="px-5 sm:px-8 pt-2 sm:pt-8 max-w-xl mx-auto">
      <section className="relative rounded-[28px] overflow-hidden shadow-soft aspect-[4/3] bg-surface-soft animate-rise-in">
        {state && <OceanScene state={state} className="absolute inset-0" />}
        {!oceanLoading && state && (
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <div className="rounded-2xl bg-white/55 backdrop-blur px-3.5 py-2 shadow-sm">
              <p className="text-[11px] font-medium text-[#2a4a43]">連続記録</p>
              <p className="text-[20px] font-extrabold text-[#1c3a35] leading-tight">{state.streakCurrent}日</p>
            </div>
            {state.finalFormReached && (
              <div className="rounded-full bg-white/55 backdrop-blur px-3 py-1.5 shadow-sm">
                <p className="text-[11px] font-bold text-[#1c3a35]">最終形態</p>
              </div>
            )}
          </div>
        )}
        {oceanLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-text-faint text-sm">
            海を呼び戻しています...
          </div>
        )}
        {!oceanLoading && oceanError && !state && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
            <p className="text-text-muted text-sm">{oceanError}</p>
            <button
              onClick={() => refreshOcean()}
              className="text-accent text-sm font-bold underline underline-offset-2"
            >
              もう一度読み込む
            </button>
          </div>
        )}
        {!oceanLoading && state && (
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[13px] font-medium text-[#1c3a35] bg-white/45 backdrop-blur inline-block px-3 py-1.5 rounded-full">
              {PHASE_LABEL[state.phase]}
            </p>
          </div>
        )}
      </section>

      <section className="text-center mt-7 animate-rise-in" style={{ animationDelay: "0.05s" }}>
        <p className="text-[13px] font-medium text-text-muted mb-1">これまでの積み重ね</p>
        {statsLoading ? (
          <div className="h-[52px] flex items-center justify-center text-text-faint text-sm">読み込み中...</div>
        ) : (
          <p className="text-[42px] leading-none font-extrabold tracking-tight text-text tabular-nums">
            {formatMinutes(totalMinutes)}
          </p>
        )}
      </section>

      <section className="mt-6 flex items-center justify-between rounded-2xl bg-surface border border-border px-5 py-4 animate-rise-in" style={{ animationDelay: "0.1s" }}>
        <div>
          <p className="text-[12px] font-medium text-text-muted mb-0.5">今日 ({todayJST().slice(5).replace("-", "/")})</p>
          <p className="text-[22px] font-extrabold text-text tabular-nums">
            {todayLoading ? "—" : formatMinutes(todayMinutes ?? 0)}
          </p>
        </div>
        <button
          onClick={() => setEditOpen(true)}
          aria-label="今日の記録を編集"
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted border border-border hover:bg-surface-soft transition-colors"
        >
          <EditIcon className="w-4.5 h-4.5" />
        </button>
      </section>

      <section className="mt-5 animate-rise-in" style={{ animationDelay: "0.15s" }}>
        <div className="grid grid-cols-4 gap-2.5">
          {QUICK_ADD_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => handleQuickAdd(m)}
              disabled={busyOption !== null}
              className="rounded-2xl bg-accent-soft text-accent font-bold py-3.5 text-[13px] active:scale-95 transition-transform disabled:opacity-50"
            >
              +{formatMinutes(m)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setQuickAddOpen(true)}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border text-text-muted font-medium py-3 text-[13px] hover:bg-surface-soft transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          任意の時間を追加
        </button>
      </section>

      <QuickAddSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} onAdd={handleCustomAdd} />
      <EditDaySheet
        open={editOpen}
        date={todayJST()}
        initialMinutes={todayMinutes ?? 0}
        onClose={() => setEditOpen(false)}
        onSaved={handleEdited}
      />
    </div>
  );
}
