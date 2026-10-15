import type {
  DataSourceInfo,
  DateFlexibility,
  DestinationSummary,
  FlightCandidate,
  PassengerConditions,
} from "../types";

export type ExploreParams = {
  originIata: string;
  flex: DateFlexibility;
  currency: string;
};

export type ExploreResult = {
  destinations: DestinationSummary[];
  info: DataSourceInfo;
};

export type DetailParams = {
  originIata: string;
  destinationIata: string;
  destinationCity: string;
  destinationCountry: string;
  flex: DateFlexibility;
  passengers: PassengerConditions;
  currency: string;
  /** 1目的地あたりに試す日程候補の最大数(API呼び出し回数の上限) */
  maxDateCandidates: number;
};

export type DetailResult = {
  candidates: FlightCandidate[];
  info: DataSourceInfo;
};

/**
 * 航空券データソースの共通インターフェース。
 * 特定のAPIに依存せず、異なるAPIの検索結果をアプリ共通の形式に変換するためのアダプター。
 */
export interface FlightDataAdapter {
  readonly id: string;
  readonly name: string;

  getStatus(): DataSourceInfo;

  /** 第1段階: 目的地未定の広域探索 */
  exploreDestinations(params: ExploreParams): Promise<ExploreResult>;

  /** 第2段階: 特定の目的地に対する実際の往復航空券の検索 */
  searchDetail(params: DetailParams): Promise<DetailResult>;
}
