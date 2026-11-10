import type { DbStudyRecord } from "@/lib/studyRecords";
import { weekdayLabelJa } from "@/lib/date";
import { DAILY_GOAL_MINUTES } from "@/lib/constants";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Excelでの日本語文字化けを防ぐため UTF-8 BOM 付きで出力する */
export function buildStudyRecordsCsv(records: DbStudyRecord[]): string {
  const header = ["日付", "曜日", "勉強時間(分)", "勉強時間", "達成"];
  const lines = [header.join(",")];

  for (const r of records) {
    const hours = Math.floor(r.minutes / 60);
    const mins = r.minutes % 60;
    const display = r.minutes > 0 ? (hours > 0 ? `${hours}時間${mins}分` : `${mins}分`) : "0分";
    const achieved = r.minutes >= DAILY_GOAL_MINUTES ? "○" : "";
    const row = [r.record_date, weekdayLabelJa(r.record_date), String(r.minutes), display, achieved];
    lines.push(row.map(escapeCsvField).join(","));
  }

  const content = lines.join("\r\n");
  return `﻿${content}`;
}
