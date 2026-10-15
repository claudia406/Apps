import type { DestinationSummary } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { PriceStateBadge } from "./PriceStateBadge";

export function DestinationList({
  destinations,
  onSelect,
}: {
  destinations: DestinationSummary[];
  onSelect: (destination: DestinationSummary) => void;
}) {
  if (destinations.length === 0) {
    return (
      <div className="empty-state">
        <p>検索できた旅行先がありませんでした。</p>
        <p className="hint">
          出発空港・日程・柔軟性の設定を見直して再検索してください。データソースが未接続の場合は上記の接続状況をご確認ください。
        </p>
      </div>
    );
  }

  return (
    <div className="destination-grid">
      {destinations.map((destination) => (
        <button
          key={`${destination.destinationIata}-${destination.dataSourceName}`}
          className="destination-card"
          onClick={() => onSelect(destination)}
          type="button"
        >
          <span className="city">{destination.destinationCity}</span>
          <span className="country">{destination.destinationCountry}</span>
          <span className="price">{formatPrice(destination.cheapestPrice, destination.currency)}</span>
          <PriceStateBadge state={destination.priceState} />
          <span className="hint">
            出発地: {destination.originIata} / データ取得元: {destination.dataSourceName}
            {destination.isCached && "(キャッシュ)"}
          </span>
          <span className="hint">取得日時: {new Date(destination.fetchedAt).toLocaleString("ja-JP")}</span>
        </button>
      ))}
    </div>
  );
}
