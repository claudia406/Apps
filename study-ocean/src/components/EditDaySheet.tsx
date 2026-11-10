"use client";

import { useEffect, useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import MinutesStepper from "@/components/MinutesStepper";
import { useToast } from "@/components/Toast";
import { todayJST } from "@/lib/date";

interface Props {
  open: boolean;
  date: string | null;
  initialMinutes: number;
  onClose: () => void;
  onSaved: (date: string, minutes: number) => void;
}

export default function EditDaySheet({ open, date, initialMinutes, onClose, onSaved }: Props) {
  const toast = useToast();
  const [value, setValue] = useState(initialMinutes);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // effect本体で直接setStateせず、マイクロタスクへ一段委譲する。
    queueMicrotask(() => {
      if (open) setValue(initialMinutes);
    });
  }, [open, initialMinutes]);

  if (!date) return null;

  const isToday = date === todayJST();
  const title = isToday ? "今日の記録を編集" : `${date.replace(/-/g, "/")} の記録を編集`;

  async function handleSave() {
    if (!date) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/records/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalMinutes: value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "保存に失敗しました");
      onSaved(date, json.minutes);
      toast.show("保存しました", "success");
      onClose();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "保存に失敗しました", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="py-4">
        <MinutesStepper value={value} onChange={setValue} />
        <p className="text-center text-[13px] text-text-faint mt-4">
          その日の合計学習時間に置き換わります（30分単位）
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full rounded-2xl bg-accent text-accent-contrast font-bold py-3.5 text-[15px] disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>
    </BottomSheet>
  );
}
