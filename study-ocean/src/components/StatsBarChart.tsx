"use client";

import { useState } from "react";
import { formatMinutes } from "@/lib/date";

interface MonthlyPoint {
  yearMonth: string;
  minutes: number;
}

interface Props {
  data: MonthlyPoint[];
}

const CHART_HEIGHT = 140;
const BAR_WIDTH = 22;
const BAR_GAP = 14;

export default function StatsBarChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="text-[13px] text-text-faint py-8 text-center">まだ記録がありません</p>;
  }

  const max = Math.max(...data.map((d) => d.minutes), 60);
  const width = data.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;
  const active = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div>
      <div className="h-[20px] mb-1 px-1">
        {active && (
          <p className="text-[12px] font-bold text-accent tabular-nums">
            {formatMonthLabel(active.yearMonth)}: {formatMinutes(active.minutes)}
          </p>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
        <svg
          width={width}
          height={CHART_HEIGHT + 28}
          viewBox={`0 0 ${width} ${CHART_HEIGHT + 28}`}
          role="img"
          aria-label="月別勉強時間グラフ"
        >
          <line x1={0} y1={CHART_HEIGHT} x2={width} y2={CHART_HEIGHT} stroke="var(--border)" strokeWidth={1} />
          {data.map((d, i) => {
            const barHeight = Math.max(2, (d.minutes / max) * (CHART_HEIGHT - 8));
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = CHART_HEIGHT - barHeight;
            const isActive = activeIndex === i;
            return (
              <g
                key={d.yearMonth}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(isActive ? null : i)}
                style={{ cursor: "pointer" }}
              >
                <rect x={x} y={0} width={BAR_WIDTH} height={CHART_HEIGHT} fill="transparent" />
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  rx={4}
                  fill={isActive ? "var(--ramp-5)" : "var(--ramp-4)"}
                  style={{ transition: "fill 0.15s ease" }}
                />
                <text
                  x={x + BAR_WIDTH / 2}
                  y={CHART_HEIGHT + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--text-faint)"
                >
                  {formatMonthLabel(d.yearMonth, true)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function formatMonthLabel(yearMonth: string, short = false): string {
  const m = Number(yearMonth.slice(5));
  return short ? `${m}月` : `${yearMonth.slice(0, 4)}年${m}月`;
}
