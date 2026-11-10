export type CreatureKind = "fish" | "shrimp" | "crab" | "shell" | "plant" | "coral" | "final";

export interface UnlockDefinition {
  /** 解放に必要な連続達成日数 */
  streakDays: number;
  id: string;
  name: string;
  kind: CreatureKind;
  description: string;
}

/**
 * 連続記録の節目で解放される生き物・植物のカタログ。
 * 7・14・30・45・60日を基本の節目とし、間に自然株（植物・サンゴ）を挟んで
 * 解放のリズムに変化をつけている。
 */
export const UNLOCKS: UnlockDefinition[] = [
  {
    streakDays: 7,
    id: "fish-small-school",
    name: "小魚の群れ",
    kind: "fish",
    description: "海草の間を静かに泳ぐ、小さな魚の群れ。",
  },
  {
    streakDays: 14,
    id: "shrimp-1",
    name: "透明なエビ",
    kind: "shrimp",
    description: "岩陰に隠れる、半透明のエビ。",
  },
  {
    streakDays: 21,
    id: "coral-branch",
    name: "枝サンゴ",
    kind: "coral",
    description: "淡いピンク色をした、繊細な枝サンゴ。",
  },
  {
    streakDays: 30,
    id: "crab-1",
    name: "小さなカニ",
    kind: "crab",
    description: "砂地をゆっくり歩く、小さなカニ。",
  },
  {
    streakDays: 37,
    id: "kelp-tall",
    name: "大きな海藻",
    kind: "plant",
    description: "ゆらゆらと水面近くまで伸びる、大きな海藻。",
  },
  {
    streakDays: 45,
    id: "shell-1",
    name: "貝殻",
    kind: "shell",
    description: "砂の中に静かに佇む、美しい貝殻。",
  },
  {
    streakDays: 52,
    id: "fish-colorful",
    name: "色とりどりの魚",
    kind: "fish",
    description: "鮮やかな色合いの魚が、海を優雅に泳ぐ。",
  },
  {
    streakDays: 60,
    id: "final-ray",
    name: "優雅なエイ",
    kind: "final",
    description: "60日の積み重ねの果てに現れる、海の最終形態の象徴。",
  },
];

export function unlockedAtStreak(streakDays: number): UnlockDefinition[] {
  return UNLOCKS.filter((u) => u.streakDays <= streakDays);
}

export function nextUnlock(currentStreakDays: number): UnlockDefinition | null {
  return UNLOCKS.find((u) => u.streakDays > currentStreakDays) ?? null;
}
