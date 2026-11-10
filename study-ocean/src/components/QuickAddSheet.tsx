"use client";

import { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import MinutesStepper from "@/components/MinutesStepper";
import { useToast } from "@/components/Toast";
import { RECORD_UNIT_MINUTES } from "@/lib/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (minutes: number) => Promise<void>;
}

export default function QuickAddSheet({ open, onClose, onAdd }: Props) {
  const toast = useToast();
  const [value, setValue] = useState(RECORD_UNIT_MINUTES);
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    setSaving(true);
    try {
      await onAdd(value);
      toast.show(`今日の記録に追加しました`, "success");
      setValue(RECORD_UNIT_MINUTES);
      onClose();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "保存に失敗しました", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="時間を追加">
      <div className="py-4">
        <MinutesStepper value={value} onChange={setValue} min={RECORD_UNIT_MINUTES} />
        <p className="text-center text-[13px] text-text-faint mt-4">今日の記録に加算されます</p>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="mt-6 w-full rounded-2xl bg-accent text-accent-contrast font-bold py-3.5 text-[15px] disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          {saving ? "保存中..." : "追加する"}
        </button>
      </div>
    </BottomSheet>
  );
}
