import type { DateStr } from "@/lib/date";

export interface StudyRecord {
  date: DateStr;
  minutes: number;
}

export interface UnlockedEntry {
  id: string;
  unlockedAt: DateStr;
}

export interface OceanState {
  lastEvaluatedDate: DateStr | null;
  /** 海の豊かさ。0(枯れた状態)〜60(最終形態) */
  health: number;
  /** 現在の連続達成日数 */
  streakCurrent: number;
  /** 過去最高の連続達成日数（減少しない） */
  streakBest: number;
  /** 現在の連続未達成日数（達成すると0に戻る） */
  missStreak: number;
  /** 今回の退化が始まった時点の health（退化カーブの基準値） */
  healthAtDegenStart: number;
  /** 累計達成日数（減少しない） */
  totalAchievedDays: number;
  /** 60日連続達成に一度でも到達したか（永続） */
  finalFormReached: boolean;
  unlocked: UnlockedEntry[];
  phase: OceanPhase;
}

export type OceanPhase = "growing" | "recovering" | "degenerating" | "dormant";

export function createInitialOceanState(): OceanState {
  return {
    lastEvaluatedDate: null,
    health: 0,
    streakCurrent: 0,
    streakBest: 0,
    missStreak: 0,
    healthAtDegenStart: 0,
    totalAchievedDays: 0,
    finalFormReached: false,
    unlocked: [],
    phase: "growing",
  };
}

export interface WeeklyGoal {
  yearMonth: string;
  goalMinutes: number;
}
