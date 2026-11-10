"use client";

import { formatMinutes } from "@/lib/date";
import { RECORD_UNIT_MINUTES } from "@/lib/constants";

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export default function MinutesStepper({ value, onChange, min = 0, max = 24 * 60 }: Props) {
  const dec = () => onChange(Math.max(min, value - RECORD_UNIT_MINUTES));
  const inc = () => onChange(Math.min(max, value + RECORD_UNIT_MINUTES));

  return (
    <div className="flex items-center justify-center gap-5">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="30分減らす"
        className="w-11 h-11 rounded-full border border-border text-xl font-bold text-text-muted disabled:opacity-30 active:scale-95 transition-transform flex items-center justify-center"
      >
        –
      </button>
      <div className="min-w-[128px] text-center">
        <span className="text-[28px] font-extrabold tabular-nums text-text">{formatMinutes(value)}</span>
      </div>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="30分増やす"
        className="w-11 h-11 rounded-full border border-border text-xl font-bold text-text-muted disabled:opacity-30 active:scale-95 transition-transform flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
