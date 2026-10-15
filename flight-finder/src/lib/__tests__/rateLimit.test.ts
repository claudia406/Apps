import { describe, expect, it, vi } from "vitest";
import { mapWithConcurrencyLimit, withRetry } from "../rateLimit";

describe("mapWithConcurrencyLimit", () => {
  it("すべての要素を処理し、結果を元の順序で返す", async () => {
    const results = await mapWithConcurrencyLimit([1, 2, 3, 4, 5], 2, async (n) => n * 10);
    expect(results).toEqual([10, 20, 30, 40, 50]);
  });

  it("同時実行数を超えて処理が走らない", async () => {
    let active = 0;
    let maxActive = 0;
    await mapWithConcurrencyLimit([1, 2, 3, 4, 5, 6], 2, async (n) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active -= 1;
      return n;
    });
    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it("空配列を渡すとエラーにならず空配列を返す", async () => {
    const results = await mapWithConcurrencyLimit([], 3, async (n) => n);
    expect(results).toEqual([]);
  });
});

describe("withRetry", () => {
  it("成功するまで再試行し、最終的な結果を返す", async () => {
    let attempts = 0;
    const result = await withRetry(
      async () => {
        attempts += 1;
        if (attempts < 3) throw new Error("一時的な失敗");
        return "成功";
      },
      { retries: 3, baseDelayMs: 1 },
    );
    expect(result).toBe("成功");
    expect(attempts).toBe(3);
  });

  it("isRetryableがfalseを返すエラーは再試行しない", async () => {
    const fn = vi.fn(async () => {
      throw new Error("再試行不可");
    });
    await expect(withRetry(fn, { retries: 5, baseDelayMs: 1, isRetryable: () => false })).rejects.toThrow("再試行不可");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries回を超えて失敗した場合は最後のエラーを投げる", async () => {
    const fn = vi.fn(async () => {
      throw new Error("常に失敗");
    });
    await expect(withRetry(fn, { retries: 2, baseDelayMs: 1 })).rejects.toThrow("常に失敗");
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
