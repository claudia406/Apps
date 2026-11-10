"use client";

import { useCallback, useEffect, useState } from "react";
import type { FullStats } from "@/lib/studyRecords";

export function useFullStats() {
  const [data, setData] = useState<FullStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/stats");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "統計の取得に失敗しました");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "統計の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // refresh() は内部で setState を行うため、effect本体から直接呼ばず
    // マイクロタスクへ一段委譲する(effect内での同期的なsetStateを避けるため)。
    queueMicrotask(() => {
      refresh();
    });
  }, [refresh]);

  return { data, loading, error, refresh };
}
