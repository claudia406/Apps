import { z } from "zod";
import { todayJST } from "@/lib/date";

const dateStrSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "日付の形式が正しくありません")
  .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()), "日付が不正です")
  .refine((v) => v <= todayJST(), "未来の日付は登録できません");

export const minutesSchema = z
  .number()
  .int()
  .min(0, "時間は0以上で入力してください")
  .max(24 * 60, "1日の時間を超えています")
  .refine((v) => v % 30 === 0, "30分単位で入力してください");

export const addMinutesSchema = z.object({
  date: dateStrSchema,
  deltaMinutes: z
    .number()
    .int()
    .positive("追加する時間は30分以上にしてください")
    .max(24 * 60, "1日の時間を超えています")
    .refine((v) => v % 30 === 0, "30分単位で入力してください"),
});

export const setMinutesSchema = z.object({
  date: dateStrSchema,
  totalMinutes: minutesSchema,
});

export const monthlyGoalSchema = z.object({
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/, "年月の形式が正しくありません"),
  goalMinutes: z
    .number()
    .int()
    .positive("目標時間は1分以上で設定してください")
    .max(31 * 24 * 60, "目標時間が大きすぎます")
    .refine((v) => v % 30 === 0, "30分単位で入力してください")
    .nullable(),
});
