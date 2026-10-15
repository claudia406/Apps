import type { DataSourceInfo, DataSourceStatus } from "@/lib/types";

const STATUS_LABELS: Record<DataSourceStatus, { label: string; className: string }> = {
  available: { label: "利用可能", className: "badge-success" },
  unconfigured: { label: "認証情報未設定", className: "badge-neutral" },
  pending_application: { label: "利用申請・契約待ち", className: "badge-warning" },
  temporary_error: { label: "一時的なエラー", className: "badge-danger" },
  rate_limited: { label: "利用制限に到達", className: "badge-warning" },
  unsupported_feature: { label: "未対応の機能あり", className: "badge-neutral" },
};

export function DataSourceStatusPanel({ sources }: { sources: DataSourceInfo[] }) {
  return (
    <div className="card">
      <strong style={{ display: "block", marginBottom: 10 }}>データソースの接続状況</strong>
      <div className="source-status-list">
        {sources.map((source) => {
          const status = STATUS_LABELS[source.status];
          return (
            <div className="source-status-row" key={source.id}>
              <span className="source-name">{source.name}</span>
              <span className={`badge ${status.className}`}>{status.label}</span>
              <span className="source-note">{source.note}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
