"use client";

import { useCallback, useEffect, useState } from "react";
import type { OceanState } from "@/lib/types";
import type { UnlockDefinition } from "@/lib/oceanContent";

export interface OceanStateResponse {
  state: OceanState;
  newlyUnlockedIds: string[];
  nextUnlock: UnlockDefinition | null;
}

export function useOceanState() {
  const [data, setData] = useState<OceanStateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<OceanStateResponse | null> => {
    setError(null);
    try {
      const res = await fetch("/api/ocean-state");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "海の状態の取得に失敗しました");
      setData(json);
      return json as OceanStateResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : "海の状態の取得に失敗しました");
      return null;
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
