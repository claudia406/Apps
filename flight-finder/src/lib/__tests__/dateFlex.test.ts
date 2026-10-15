import { describe, expect, it } from "vitest";
import { generateDateCandidates, resolveDatesFromActual, toResolvedDates } from "../dateFlex";

describe("generateDateCandidates", () => {
  const baseFlex = {
    departDate: "2026-12-01",
    returnDate: "2026-12-08",
    departFlexDays: 3,
    returnFlexDays: 3,
  };

  it("当初日程(オフセット0,0)を候補として含む", () => {
    const candidates = generateDateCandidates(baseFlex);
    const exact = candidates.find((c) => c.departDiffDays === 0 && c.returnDiffDays === 0);
    expect(exact).toBeDefined();
    expect(exact?.departDate).toBe("2026-12-01");
    expect(exact?.returnDate).toBe("2026-12-08");
    expect(exact?.stayDays).toBe(7);
  });

  it("前後3日の柔軟性を正しく適用する(±3日の範囲内のみ生成される)", () => {
    const candidates = generateDateCandidates(baseFlex);
    for (const c of candidates) {
      expect(Math.abs(c.departDiffDays)).toBeLessThanOrEqual(3);
      expect(Math.abs(c.returnDiffDays)).toBeLessThanOrEqual(3);
    }
    // 出発7パターン x 帰国7パターン = 49通りのうち、滞在日数が1日以上のもののみ残る
    expect(candidates.length).toBeLessThanOrEqual(49);
    expect(candidates.length).toBeGreaterThan(0);
  });

  it("当初日程に近い候補ほど先頭に来るよう並んでいる(deviationScore昇順)", () => {
    const candidates = generateDateCandidates(baseFlex);
    for (let i = 1; i < candidates.length; i += 1) {
      expect(candidates[i].deviationScore).toBeGreaterThanOrEqual(candidates[i - 1].deviationScore);
    }
  });

  it("滞在日数の下限・上限を指定すると範囲外の候補は除外される", () => {
    const candidates = generateDateCandidates({ ...baseFlex, minStayDays: 7, maxStayDays: 7 });
    expect(candidates.every((c) => c.stayDays === 7)).toBe(true);
    expect(candidates.length).toBeGreaterThan(0);
  });

  it("柔軟性適用後も帰国日が出発日以前になる組み合わせは生成しない", () => {
    const candidates = generateDateCandidates({
      departDate: "2026-12-05",
      returnDate: "2026-12-06",
      departFlexDays: 3,
      returnFlexDays: 3,
    });
    expect(candidates.every((c) => c.stayDays >= 1)).toBe(true);
  });

  it("帰国日が出発日以前の入力はエラーにする", () => {
    expect(() =>
      generateDateCandidates({ departDate: "2026-12-10", returnDate: "2026-12-05", departFlexDays: 0, returnFlexDays: 0 }),
    ).toThrow();
  });

  it("負の柔軟性日数はエラーにする", () => {
    expect(() => generateDateCandidates({ ...baseFlex, departFlexDays: -1 })).toThrow();
  });
});

describe("toResolvedDates / resolveDatesFromActual", () => {
  const flex = { departDate: "2026-12-01", returnDate: "2026-12-08", departFlexDays: 3, returnFlexDays: 3 };

  it("候補の採用日程から、当初日程との差分を正しく計算する", () => {
    const candidates = generateDateCandidates(flex);
    const shifted = candidates.find((c) => c.departDiffDays === 2 && c.returnDiffDays === -1);
    expect(shifted).toBeDefined();
    const resolved = toResolvedDates(flex, shifted!);
    expect(resolved.requestedStayDays).toBe(7);
    expect(resolved.departDiffDays).toBe(2);
    expect(resolved.returnDiffDays).toBe(-1);
  });

  it("APIが返した実際の日時文字列から差分を計算できる(時刻付きでも日付部分のみ使用)", () => {
    const resolved = resolveDatesFromActual(flex, "2026-12-03T10:30:00", "2026-12-09T22:00:00");
    expect(resolved.actualDepartDate).toBe("2026-12-03");
    expect(resolved.actualReturnDate).toBe("2026-12-09");
    expect(resolved.departDiffDays).toBe(2);
    expect(resolved.returnDiffDays).toBe(1);
    expect(resolved.stayDays).toBe(6);
  });
});
