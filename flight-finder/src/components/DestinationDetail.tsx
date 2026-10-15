"use client";

import { useMemo, useState } from "react";
import type { FlightCandidate } from "@/lib/types";
import { formatDateTime, formatDiffDays, formatDuration, formatPrice } from "@/lib/format";
import { PriceStateBadge } from "./PriceStateBadge";

type SortKey = "price" | "duration" | "transfers" | "flexibility";

const SORT_LABELS: Record<SortKey, string> = {
  price: "往復総額が安い順",
  duration: "総所要時間が短い順",
  transfers: "乗継回数が少ない順",
  flexibility: "当初日程に近い順",
};

function flexibilityScore(candidate: FlightCandidate): number {
  return Math.abs(candidate.resolvedDates.departDiffDays) + Math.abs(candidate.resolvedDates.returnDiffDays);
}

function sortCandidates(candidates: FlightCandidate[], key: SortKey): FlightCandidate[] {
  const sorted = [...candidates];
  switch (key) {
    case "price":
      sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "duration":
      sorted.sort((a, b) => (a.durationMinutes ?? Infinity) - (b.durationMinutes ?? Infinity));
      break;
    case "transfers":
      sorted.sort((a, b) => (a.transfers ?? Infinity) - (b.transfers ?? Infinity));
      break;
    case "flexibility":
      sorted.sort((a, b) => flexibilityScore(a) - flexibilityScore(b));
      break;
  }
  return sorted;
}

export function DestinationDetail({ candidates }: { candidates: FlightCandidate[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const sorted = useMemo(() => sortCandidates(candidates, sortKey), [candidates, sortKey]);

  if (candidates.length === 0) {
    return (
      <div className="empty-state">
        <p>この目的地では、実際に検索できた往復航空券候補がありませんでした。</p>
        <p className="hint">日程の柔軟性を広げるか、他の目的地をお試しください。</p>
      </div>
    );
  }

  return (
    <div>
      <p className="hint" style={{ marginBottom: 12 }}>
        並べ替えの基準(「最安値」と「おすすめ」は区別しています。根拠のない総合スコアでの並べ替えは行いません):
      </p>
      <div className="sort-bar" role="group" aria-label="並べ替え">
        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className="btn"
            aria-pressed={sortKey === key}
            onClick={() => setSortKey(key)}
          >
            {SORT_LABELS[key]}
          </button>
        ))}
      </div>

      {sorted.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: FlightCandidate }) {
  const { resolvedDates, bookingLink } = candidate;

  return (
    <article className="candidate-card">
      <div className="candidate-head">
        <span className="candidate-price">{formatPrice(candidate.price, candidate.currency)}</span>
        <PriceStateBadge state={candidate.priceState} />
      </div>

      <dl className="candidate-meta">
        <div>
          <dt>航空会社</dt>
          <dd>{candidate.airline ?? "未確認"}</dd>
        </div>
        <div>
          <dt>総所要時間</dt>
          <dd>{formatDuration(candidate.durationMinutes)}</dd>
        </div>
        <div>
          <dt>乗継回数(往路/復路)</dt>
          <dd>
            {candidate.transfers ?? "未確認"} / {candidate.returnTransfers ?? "未確認"}
          </dd>
        </div>
        <div>
          <dt>出発地</dt>
          <dd>{candidate.originIata}</dd>
        </div>
      </dl>

      <div className="notice notice-info">
        <strong>日程:</strong> 当初希望 {resolvedDates.requestedDepartDate} 〜 {resolvedDates.requestedReturnDate}(滞在
        {resolvedDates.requestedStayDays}日) → 実際の候補 {resolvedDates.actualDepartDate} 〜 {resolvedDates.actualReturnDate}
        (滞在{resolvedDates.stayDays}日)
        <br />
        出発日: {formatDiffDays(resolvedDates.departDiffDays)} / 帰国日: {formatDiffDays(resolvedDates.returnDiffDays)}
      </div>

      <p className="hint">預け荷物: {candidate.baggageInfo}</p>
      <p className="hint">運賃条件(変更・キャンセル): {candidate.fareConditions}</p>
      <p className="hint">
        データ取得元: {candidate.dataSourceName}
        {candidate.isCached && "(キャッシュされた検索価格。リアルタイムの在庫再確認は未対応です)"} / 取得日時:{" "}
        {formatDateTime(candidate.fetchedAt)}
      </p>

      <div className="notice notice-warning">
        予約直前の価格再確認: 現在接続中のデータソースには在庫・価格の再照会APIがないため、このアプリ内では再確認できません。下記リンクの予約先サイトで最新の価格・空席を必ずご確認ください。
      </div>

      <BookingLinkButton link={bookingLink} />
    </article>
  );
}

function BookingLinkButton({ link }: { link: FlightCandidate["bookingLink"] }) {
  if (!link.url) {
    return <p className="notice notice-danger">この旅程に対応する予約先リンクを取得できませんでした。{link.note}</p>;
  }

  return (
    <div>
      <a className="btn btn-primary" href={link.url} target="_blank" rel="noopener noreferrer">
        {link.providerName}で{link.isSearchResultsPage ? "検索結果を見る" : "この旅程を見る"}
      </a>
      <p className="hint" style={{ marginTop: 6 }}>
        {link.note}
      </p>
    </div>
  );
}
