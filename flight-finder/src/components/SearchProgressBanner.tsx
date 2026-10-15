import type { SearchProgress } from "@/lib/types";

export function SearchProgressBanner({ progress, searchedAt }: { progress: SearchProgress; searchedAt: string }) {
  const hasFailures = progress.failedQueries > 0;
  return (
    <div className={`notice ${hasFailures ? "notice-warning" : "notice-info"}`}>
      検索完了: {progress.completedQueries}/{progress.totalPlannedQueries} 件のデータソースから取得できました
      {hasFailures && `(${progress.failedQueries}件は取得に失敗しました)`}。
      {progress.limitNote && <> {progress.limitNote}</>}
      <br />
      検索実行時刻: {new Date(searchedAt).toLocaleString("ja-JP")}
    </div>
  );
}
