import type { PriceState } from "@/lib/types";

const LABELS: Record<PriceState, { label: string; className: string }> = {
  reference: { label: "参考価格", className: "badge-neutral" },
  searched: { label: "検索価格", className: "badge-neutral" },
  reverified: { label: "再確認済み", className: "badge-success" },
  changed: { label: "価格変更あり", className: "badge-warning" },
  unavailable: { label: "販売終了・確認失敗", className: "badge-danger" },
};

export function PriceStateBadge({ state }: { state: PriceState }) {
  const info = LABELS[state];
  return <span className={`badge ${info.className}`}>{info.label}</span>;
}
