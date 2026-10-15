// アプリ共通のドメイン型。
// 複数のデータソース(アダプター)はそれぞれ異なるレスポンス形式を持つため、
// すべてここで定義する共通形式に変換してから画面に渡す。

/** 価格の信頼性の状態。仕様書6章の5区分に対応する。 */
export type PriceState =
  | "reference" // 参考価格: キャッシュ等から取得した参考値
  | "searched" // 検索価格: 航空券APIから取得した価格
  | "reverified" // 再確認済み: 選択した旅程の価格・空席を再照会した状態
  | "changed" // 価格変更: 再照会で価格が変わった状態
  | "unavailable"; // 販売終了・確認失敗: 購入可能性を確認できない状態

/** データソース(API)の利用可能状態。 */
export type DataSourceStatus =
  | "available" // 利用可能
  | "unconfigured" // 認証情報未設定
  | "pending_application" // 利用申請・契約待ち
  | "temporary_error" // 一時的なエラー
  | "rate_limited" // 利用制限に到達
  | "unsupported_feature"; // 未対応の機能あり

export type DataSourceInfo = {
  id: string;
  name: string;
  status: DataSourceStatus;
  note: string;
};

/** 日程の柔軟性設定 */
export type DateFlexibility = {
  departDate: string; // YYYY-MM-DD (当初指定の出発日)
  returnDate: string; // YYYY-MM-DD (当初指定の帰国日)
  departFlexDays: number; // 出発日の前後許容日数
  returnFlexDays: number; // 帰国日の前後許容日数
  minStayDays?: number; // 滞在日数の下限(任意)
  maxStayDays?: number; // 滞在日数の上限(任意)
};

/** 柔軟性を適用した結果、実際に採用された日程候補 */
export type ResolvedDates = {
  requestedDepartDate: string;
  requestedReturnDate: string;
  actualDepartDate: string;
  actualReturnDate: string;
  departDiffDays: number; // 当初出発日からの差(日数, 正負あり)
  returnDiffDays: number; // 当初帰国日からの差(日数, 正負あり)
  stayDays: number; // 現地滞在日数
  requestedStayDays: number;
};

export type PassengerConditions = {
  adults: number;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  checkedBaggage: "unspecified" | "required";
};

/** 予約先リンクの種類(仕様書7章の優先順位) */
export type BookingLinkTier =
  | "api_offer_link" // 1. APIが提供する、選択した旅程に対応する予約リンク
  | "airline_official" // 2. 航空会社公式サイト
  | "travel_agency_site" // 3. 実際の旅程に対応する旅行予約サイト
  | "none"; // 4. 直接遷移できるリンクがない

export type BookingLink = {
  tier: BookingLinkTier;
  url: string | null;
  providerName: string;
  isSearchResultsPage: boolean; // true = 検索結果ページ止まり(購入ページではない)
  note: string;
};

/** 1つの旅程候補(往路+復路のセット) */
export type FlightCandidate = {
  id: string;
  sourceId: string; // どのデータソースから取得したか
  destinationIata: string;
  destinationCity: string;
  destinationCountry: string;
  originIata: string;

  priceState: PriceState;
  price: number | null;
  currency: string | null;

  resolvedDates: ResolvedDates;

  airline: string | null; // 未確認の場合は null
  transfers: number | null; // 乗継回数。未確認の場合は null
  returnTransfers: number | null;
  durationMinutes: number | null; // 総所要時間(分)。未確認の場合は null

  baggageInfo: string; // 未確認の場合は "未確認" を明示する文字列
  fareConditions: string; // 運賃条件(変更/キャンセル)。未確認なら "未確認"

  bookingLink: BookingLink;

  fetchedAt: string; // ISO8601. データ取得日時
  dataSourceName: string;
  isCached: boolean; // キャッシュされた情報かどうか
};

/** 広域探索(第1段階)の1件分 */
export type DestinationSummary = {
  destinationIata: string;
  destinationCity: string;
  destinationCountry: string;
  cheapestPrice: number | null;
  currency: string | null;
  priceState: PriceState;
  originIata: string;
  fetchedAt: string;
  dataSourceName: string;
  isCached: boolean;
};

export type SearchProgress = {
  totalPlannedQueries: number;
  completedQueries: number;
  failedQueries: number;
  truncatedByLimit: boolean;
  limitNote: string | null;
};

export type SearchMeta = {
  sources: DataSourceInfo[];
  progress: SearchProgress;
  searchedAt: string;
};
