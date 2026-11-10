"use client";

import { useCallback, useEffect, useState } from "react";

export function useTodayRecord() {
  const [minutes, setMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/records/today");
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "取得に失敗しました");
    setMinutes(json.minutes);
    setError(null);
    setLoading(false);
    return json.minutes as number;
  }, []);

  useEffect(() => {
    // refresh() は内部で setState を行うため、effect本体から直接呼ばず
    // マイクロタスクへ一段委譲する(effect内での同期的なsetStateを避けるため)。
    queueMicrotask(() => {
      refresh().catch((err) => {
        setError(err instanceof Error ? err.message : "取得に失敗しました");
        setLoading(false);
      });
    });
  }, [refresh]);

  const addMinutes = useCallback(async (delta: number) => {
    setSaving(true);
    try {
      const res = await fetch("/api/records/today", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deltaMinutes: delta }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "保存に失敗しました");
      setMinutes(json.minutes);
      return json.minutes as number;
    } finally {
      setSaving(false);
    }
  }, []);

  const setTotalMinutes = useCallback(async (date: string, total: number) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/records/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalMinutes: total }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "保存に失敗しました");
      if (json.date === undefined) return json.minutes as number;
      return json.minutes as number;
    } finally {
      setSaving(false);
    }
  }, []);

  return { minutes, loading, saving, error, addMinutes, setTotalMinutes, refresh };
}
