"use client";

import { useEffect, useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import { useToast } from "@/components/Toast";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { DownloadIcon } from "@/components/icons";
import { todayJST, yearMonthOf, formatMinutes } from "@/lib/date";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsSheet({ open, onClose }: Props) {
  const toast = useToast();
  const { canPrompt, installed, promptInstall } = useInstallPrompt();
  const yearMonth = yearMonthOf(todayJST());

  const [goalHours, setGoalHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    // effect本体で直接setStateせず、マイクロタスクへ一段委譲する。
    queueMicrotask(() => {
      setLoading(true);
      fetch(`/api/goal?ym=${yearMonth}`)
        .then((r) => r.json())
        .then((data) => {
          setCurrentGoal(data.goalMinutes ?? null);
          setGoalHours(data.goalMinutes ? String(data.goalMinutes / 60) : "");
        })
        .catch(() => toast.show("目標の取得に失敗しました", "error"))
        .finally(() => setLoading(false));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function saveGoal() {
    const hours = parseFloat(goalHours);
    if (Number.isNaN(hours) || hours <= 0) {
      toast.show("正しい時間を入力してください", "error");
      return;
    }
    const minutes = Math.round((hours * 60) / 30) * 30;
    setSaving(true);
    try {
      const res = await fetch("/api/goal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearMonth, goalMinutes: minutes }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "保存に失敗しました");
      setCurrentGoal(minutes);
      toast.show("月間目標を保存しました", "success");
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "保存に失敗しました", "error");
    } finally {
      setSaving(false);
    }
  }

  async function clearGoal() {
    setSaving(true);
    try {
      const res = await fetch("/api/goal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearMonth, goalMinutes: null }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "削除に失敗しました");
      setCurrentGoal(null);
      setGoalHours("");
      toast.show("月間目標を未設定にしました", "success");
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "削除に失敗しました", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="設定">
      <section className="pb-6">
        <h3 className="text-[13px] font-bold text-text-muted mb-2">今月の目標時間</h3>
        {loading ? (
          <div className="text-sm text-text-faint">読み込み中...</div>
        ) : (
          <>
            {currentGoal !== null && (
              <p className="text-sm text-text-muted mb-2">現在の目標: {formatMinutes(currentGoal)}</p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={0.5}
                step={0.5}
                value={goalHours}
                onChange={(e) => setGoalHours(e.target.value)}
                placeholder="例: 40"
                className="flex-1 rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[15px] outline-none focus:border-accent"
              />
              <span className="text-sm text-text-muted">時間 / 月</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={saveGoal}
                disabled={saving}
                className="flex-1 rounded-xl bg-accent text-accent-contrast text-sm font-bold py-2.5 disabled:opacity-50"
              >
                保存する
              </button>
              {currentGoal !== null && (
                <button
                  onClick={clearGoal}
                  disabled={saving}
                  className="rounded-xl border border-border text-sm font-medium py-2.5 px-4 text-text-muted disabled:opacity-50"
                >
                  未設定にする
                </button>
              )}
            </div>
          </>
        )}
      </section>

      <section className="pb-6 border-t border-border pt-5">
        <h3 className="text-[13px] font-bold text-text-muted mb-2">データのバックアップ</h3>
        <p className="text-sm text-text-muted leading-relaxed mb-3">
          学習記録はすべて日付・分数単位の CSV として書き出せます。Excel で開く際も日本語が文字化けしません。
        </p>
        <a
          href="/api/export/csv"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text hover:bg-surface-soft transition-colors"
        >
          <DownloadIcon className="w-4 h-4" />
          CSVをダウンロード
        </a>
      </section>

      <section className="pb-2 border-t border-border pt-5">
        <h3 className="text-[13px] font-bold text-text-muted mb-2">ホーム画面に追加</h3>
        {installed ? (
          <p className="text-sm text-text-muted leading-relaxed">すでにアプリとして追加されています。</p>
        ) : canPrompt ? (
          <button
            onClick={promptInstall}
            className="rounded-xl bg-accent text-accent-contrast text-sm font-bold py-2.5 px-4"
          >
            ホーム画面に追加する
          </button>
        ) : (
          <p className="text-sm text-text-muted leading-relaxed">
            Safari の場合は共有ボタン →「ホーム画面に追加」、Chrome の場合はメニュー →「アプリをインストール」から追加できます。
          </p>
        )}
      </section>
    </BottomSheet>
  );
}
