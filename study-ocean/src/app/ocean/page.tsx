"use client";

import OceanScene from "@/components/ocean/OceanScene";
import { useOceanState } from "@/hooks/useOceanState";
import { UNLOCKS } from "@/lib/oceanContent";
import { healthFraction } from "@/components/ocean/oceanVisual";

const PHASE_LABEL: Record<string, string> = {
  growing: "成長中",
  recovering: "回復中",
  degenerating: "退化中",
  dormant: "休眠中",
};

export default function OceanPage() {
  const { data, loading, error, refresh } = useOceanState();
  const state = data?.state;

  return (
    <div className="px-5 sm:px-8 pt-2 sm:pt-8 pb-6 max-w-2xl mx-auto">
      <h1 className="text-[20px] font-extrabold text-text mb-4">Ocean</h1>

      <section className="relative rounded-[28px] overflow-hidden shadow-soft aspect-[5/4] bg-surface-soft animate-rise-in">
        {state && <OceanScene state={state} className="absolute inset-0" />}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-text-faint text-sm">
            海を眺めています...
          </div>
        )}
        {!loading && error && !state && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
            <p className="text-text-muted text-sm">{error}</p>
            <button onClick={() => refresh()} className="text-accent text-sm font-bold underline underline-offset-2">
              もう一度読み込む
            </button>
          </div>
        )}
      </section>

      {state && (
        <>
          <section className="grid grid-cols-3 gap-2.5 mt-5">
            <StatBox label="状態" value={PHASE_LABEL[state.phase]} />
            <StatBox label="連続記録" value={`${state.streakCurrent}日`} />
            <StatBox label="自己最高" value={`${state.streakBest}日`} />
          </section>

          <section className="mt-5 rounded-2xl bg-surface border border-border px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-bold text-text-muted">海の豊かさ</p>
              <p className="text-[13px] font-bold text-accent">{Math.round(healthFraction(state.health) * 100)}%</p>
            </div>
            <div className="h-2.5 rounded-full bg-surface-soft overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-700"
                style={{ width: `${healthFraction(state.health) * 100}%` }}
              />
            </div>
            {state.finalFormReached ? (
              <p className="text-[13px] text-text-muted mt-3">
                60日連続達成、おめでとうございます。海は最終形態に到達しました。これからも静かな変化を続けていきます。
              </p>
            ) : (
              <NextMilestone streakCurrent={state.streakCurrent} />
            )}
          </section>

          <section className="mt-6">
            <h2 className="text-[15px] font-bold text-text mb-3">図鑑</h2>
            <div className="grid grid-cols-2 gap-3">
              {UNLOCKS.map((u) => {
                const unlocked = state.unlocked.some((e) => e.id === u.id);
                return (
                  <div
                    key={u.id}
                    className={`rounded-2xl border px-4 py-3.5 transition-colors ${
                      unlocked ? "border-border bg-surface" : "border-border/60 bg-surface-soft"
                    }`}
                  >
                    <p className={`text-[14px] font-bold mb-1 ${unlocked ? "text-text" : "text-text-faint"}`}>
                      {unlocked ? u.name : "？？？"}
                    </p>
                    <p className="text-[12px] text-text-faint leading-relaxed">
                      {unlocked ? u.description : `連続${u.streakDays}日で解放`}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface border border-border px-3 py-3.5 text-center">
      <p className="text-[11px] font-medium text-text-muted mb-1">{label}</p>
      <p className="text-[15px] font-extrabold text-text">{value}</p>
    </div>
  );
}

function NextMilestone({ streakCurrent }: { streakCurrent: number }) {
  const next = UNLOCKS.find((u) => u.streakDays > streakCurrent);
  if (!next) return null;
  const daysLeft = next.streakDays - streakCurrent;
  return (
    <p className="text-[13px] text-text-muted mt-3">
      次の解放まであと <span className="font-bold text-accent">{daysLeft}日</span> ・ {next.name}
    </p>
  );
}
