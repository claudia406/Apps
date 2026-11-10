/** 1日の達成に必要な最低学習分数 */
export const DAILY_GOAL_MINUTES = 30;

/** 記録の単位（分） */
export const RECORD_UNIT_MINUTES = 30;

/** 海が最終形態に到達する連続記録日数 */
export const FINAL_FORM_STREAK_DAYS = 60;

/** 退化が完了するまでの日数（未達翌日を1日目とする） */
export const DEGEN_TOTAL_DAYS = 7;

/** ホーム画面のクイック追加ボタン（分） */
export const QUICK_ADD_OPTIONS = [30, 60, 90, 120] as const;

export const COLORS = {
  seaMist: "#DCEBE8",
  softAqua: "#A8CFC7",
  sage: "#8FB7AD",
  paleBlue: "#B8C9E0",
  lavender: "#D8C8E4",
  sand: "#E8D6C6",
} as const;
