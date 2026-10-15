import type { DateFlexibility, ResolvedDates } from "./types";

export type DateCandidate = {
  departDate: string;
  returnDate: string;
  departDiffDays: number;
  returnDiffDays: number;
  stayDays: number;
  /** 当初日程からの総合的な離れ具合(小さいほど当初日程に近い) */
  deviationScore: number;
};

function parseIsoDate(value: string): Date {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`不正な日付形式です: ${value}`);
  }
  return date;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function diffInDays(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((a.getTime() - b.getTime()) / msPerDay);
}

/**
 * 出発日・帰国日の柔軟性設定から、検索すべき日程候補を列挙する。
 * 当初日程に近い候補を優先し(deviationScore昇順)、滞在日数の許容範囲外のものは除外する。
 */
export function generateDateCandidates(flex: DateFlexibility): DateCandidate[] {
  if (flex.departFlexDays < 0 || flex.returnFlexDays < 0) {
    throw new Error("柔軟性の日数には0以上の値を指定してください");
  }

  const requestedDepart = parseIsoDate(flex.departDate);
  const requestedReturn = parseIsoDate(flex.returnDate);
  const requestedStayDays = diffInDays(requestedReturn, requestedDepart);

  if (requestedStayDays < 1) {
    throw new Error("帰国日は出発日より後の日付を指定してください");
  }

  const candidates: DateCandidate[] = [];

  for (let dOffset = -flex.departFlexDays; dOffset <= flex.departFlexDays; dOffset += 1) {
    for (let rOffset = -flex.returnFlexDays; rOffset <= flex.returnFlexDays; rOffset += 1) {
      const departDate = addDays(requestedDepart, dOffset);
      const returnDate = addDays(requestedReturn, rOffset);
      const stayDays = diffInDays(returnDate, departDate);

      if (stayDays < 1) continue; // 帰国日が出発日以前になる組み合わせは除外
      if (flex.minStayDays !== undefined && stayDays < flex.minStayDays) continue;
      if (flex.maxStayDays !== undefined && stayDays > flex.maxStayDays) continue;

      candidates.push({
        departDate: formatIsoDate(departDate),
        returnDate: formatIsoDate(returnDate),
        departDiffDays: dOffset,
        returnDiffDays: rOffset,
        stayDays,
        deviationScore: Math.abs(dOffset) + Math.abs(rOffset) + Math.abs(stayDays - requestedStayDays),
      });
    }
  }

  candidates.sort((a, b) => a.deviationScore - b.deviationScore);
  return candidates;
}

/**
 * APIが実際に返した出発日・帰国日(文字列。日時付きの場合は日付部分のみ使用)から、
 * 当初希望日程との差分を計算する。候補生成時の想定日と実際の結果が異なる場合に用いる。
 */
export function resolveDatesFromActual(
  flex: DateFlexibility,
  actualDepartDateTime: string,
  actualReturnDateTime: string,
): ResolvedDates {
  const actualDepartDate = actualDepartDateTime.slice(0, 10);
  const actualReturnDate = actualReturnDateTime.slice(0, 10);

  const requestedDepart = parseIsoDate(flex.departDate);
  const requestedReturn = parseIsoDate(flex.returnDate);
  const requestedStayDays = diffInDays(requestedReturn, requestedDepart);

  const actualDepart = parseIsoDate(actualDepartDate);
  const actualReturn = parseIsoDate(actualReturnDate);

  return {
    requestedDepartDate: flex.departDate,
    requestedReturnDate: flex.returnDate,
    actualDepartDate,
    actualReturnDate,
    departDiffDays: diffInDays(actualDepart, requestedDepart),
    returnDiffDays: diffInDays(actualReturn, requestedReturn),
    stayDays: diffInDays(actualReturn, actualDepart),
    requestedStayDays,
  };
}

export function toResolvedDates(flex: DateFlexibility, candidate: DateCandidate): ResolvedDates {
  const requestedDepart = parseIsoDate(flex.departDate);
  const requestedReturn = parseIsoDate(flex.returnDate);
  const requestedStayDays = diffInDays(requestedReturn, requestedDepart);

  return {
    requestedDepartDate: flex.departDate,
    requestedReturnDate: flex.returnDate,
    actualDepartDate: candidate.departDate,
    actualReturnDate: candidate.returnDate,
    departDiffDays: candidate.departDiffDays,
    returnDiffDays: candidate.returnDiffDays,
    stayDays: candidate.stayDays,
    requestedStayDays,
  };
}
