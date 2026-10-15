import { z } from "zod";
import type { DataSourceInfo, DestinationSummary, FlightCandidate } from "../types";
import { generateDateCandidates, resolveDatesFromActual } from "../dateFlex";
import { buildLinkFromApiPath, buildSearchResultsLink } from "../bookingLink";
import { fetchWithTimeout, mapWithConcurrencyLimit, withRetry } from "../rateLimit";
import { lookupWorldAirport } from "../worldAirports";
import type { DetailParams, DetailResult, ExploreParams, ExploreResult, FlightDataAdapter } from "./types";

const API_BASE = "https://api.travelpayouts.com";
const SOURCE_ID = "aviasales";
const SOURCE_NAME = "Aviasales Data API (Travelpayouts)";

// 公開ドキュメントで確認できた目安(/v1/prices/calendar で300req/分)を参考に、
// 実トークンでの検証ができていないため安全側に小さく設定した同時実行数。
// 本番トークン投入後に実際のレート制限を確認し、必要に応じて調整すること。
const MAX_CONCURRENT_REQUESTS = 3;
const FETCH_TIMEOUT_MS = 8000;
const RETRY_COUNT = 2;
const RETRY_BASE_DELAY_MS = 500;

function getToken(): string | undefined {
  return process.env.TRAVELPAYOUTS_TOKEN;
}

function getMarker(): string | undefined {
  return process.env.TRAVELPAYOUTS_MARKER;
}

const rawLeafSchema = z
  .object({
    price: z.number().optional(),
    airline: z.string().optional(),
    flight_number: z.union([z.string(), z.number()]).optional(),
    departure_at: z.string().optional(),
    return_at: z.string().optional(),
    transfers: z.number().optional(),
    return_transfers: z.number().optional(),
    duration: z.number().optional(),
    duration_to: z.number().optional(),
    duration_back: z.number().optional(),
    link: z.string().optional(),
    found_at: z.string().optional(),
  })
  .passthrough();

type RawLeaf = z.infer<typeof rawLeafSchema>;

/**
 * /v1/prices/cheap のレスポンスは目的地ごとにネストした構造(経由回数などでグルーピング)で
 * 返ってくることがあるため、価格を持つ末端のオブジェクトを再帰的に収集する。
 * ネストの深さや意味を仮定せず、実際に price を持つ値だけを信頼する。
 */
function collectLeaves(node: unknown, depth = 0): RawLeaf[] {
  if (depth > 3 || node === null || typeof node !== "object") return [];
  const parsed = rawLeafSchema.safeParse(node);
  if (parsed.success && typeof parsed.data.price === "number") {
    return [parsed.data];
  }
  let leaves: RawLeaf[] = [];
  for (const value of Object.values(node as Record<string, unknown>)) {
    leaves = leaves.concat(collectLeaves(value, depth + 1));
  }
  return leaves;
}

const cheapResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  currency: z.string().optional(),
  error: z.string().optional(),
});

const pricesForDatesResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(rawLeafSchema.extend({ origin: z.string().optional(), destination: z.string().optional() })).optional(),
  currency: z.string().optional(),
  error: z.string().optional(),
});

async function callJson(url: string): Promise<unknown> {
  const response = await withRetry(
    () => fetchWithTimeout(url, { headers: { Accept: "application/json" } }, FETCH_TIMEOUT_MS),
    {
      retries: RETRY_COUNT,
      baseDelayMs: RETRY_BASE_DELAY_MS,
      isRetryable: (error) => {
        if (error instanceof Response) return error.status === 429 || error.status >= 500;
        return true;
      },
    },
  );

  if (response.status === 429) {
    throw new RateLimitError();
  }
  if (!response.ok) {
    throw new Error(`Aviasales APIがエラーを返しました(HTTP ${response.status})`);
  }
  return response.json();
}

class RateLimitError extends Error {
  constructor() {
    super("Aviasales APIのレート制限に達しました");
    this.name = "RateLimitError";
  }
}

type OfferToCandidateParams = {
  originIata: string;
  destinationIata: string;
  destinationCity: string;
  destinationCountry: string;
  flex: import("../types").DateFlexibility;
  passengers: import("../types").PassengerConditions;
  currency: string;
};

/**
 * APIが返した生の旅程1件を、アプリ共通のFlightCandidate形式に変換する。
 * 価格・出発日・帰国日のいずれかが欠けている場合は変換せずnullを返す(推測で埋めない)。
 */
export function offerToCandidate(
  offer: RawLeaf,
  params: OfferToCandidateParams,
  marker: string | undefined,
  sourceId: string,
  sourceName: string,
): FlightCandidate | null {
  if (typeof offer.price !== "number" || !offer.departure_at || !offer.return_at) return null;

  const resolvedDates = resolveDatesFromActual(params.flex, offer.departure_at, offer.return_at);

  const withinRequestedFlexibility =
    Math.abs(resolvedDates.departDiffDays) <= params.flex.departFlexDays &&
    Math.abs(resolvedDates.returnDiffDays) <= params.flex.returnFlexDays &&
    (params.flex.minStayDays === undefined || resolvedDates.stayDays >= params.flex.minStayDays) &&
    (params.flex.maxStayDays === undefined || resolvedDates.stayDays <= params.flex.maxStayDays);

  const bookingLink = offer.link
    ? buildLinkFromApiPath(offer.link, marker)
    : buildSearchResultsLink({
        originIata: params.originIata,
        destinationIata: params.destinationIata,
        departDate: resolvedDates.actualDepartDate,
        returnDate: resolvedDates.actualReturnDate,
        adults: params.passengers.adults,
        cabinClass: params.passengers.cabinClass,
        marker,
      });

  const durationMinutes =
    typeof offer.duration === "number"
      ? offer.duration
      : typeof offer.duration_to === "number" && typeof offer.duration_back === "number"
        ? offer.duration_to + offer.duration_back
        : null;

  return {
    id: dedupeKeyForOffer(offer),
    sourceId,
    destinationIata: params.destinationIata,
    destinationCity: params.destinationCity,
    destinationCountry: params.destinationCountry,
    originIata: params.originIata,
    priceState: "reference",
    price: offer.price,
    currency: params.currency,
    resolvedDates,
    withinRequestedFlexibility,
    airline: offer.airline ?? null,
    transfers: offer.transfers ?? null,
    returnTransfers: offer.return_transfers ?? null,
    durationMinutes,
    baggageInfo: "未確認(予約先サイトでご確認ください)",
    fareConditions: "未確認(予約先サイトでご確認ください)",
    bookingLink,
    fetchedAt: offer.found_at ?? new Date().toISOString(),
    dataSourceName: sourceName,
    isCached: true,
  };
}

/** 同一旅程(航空会社+フライト番号+日時+価格)を識別するためのキー。重複除去に用いる。 */
export function dedupeKeyForOffer(offer: RawLeaf): string {
  return `${offer.airline ?? ""}-${offer.flight_number ?? ""}-${offer.departure_at ?? ""}-${offer.return_at ?? ""}-${offer.price ?? ""}`;
}

/**
 * 複数の日程候補クエリの結果(オファーの配列のリスト)をまとめ、重複を除去しながら
 * FlightCandidateの配列に変換する。同じ旅程でも販売条件が異なる場合は
 * dedupeKeyForOfferが別のキーを返すため、別候補として残る。
 */
export function dedupeAndConvertOffers(
  offerLists: RawLeaf[][],
  params: OfferToCandidateParams,
  marker: string | undefined,
  sourceId: string,
  sourceName: string,
): FlightCandidate[] {
  const seen = new Set<string>();
  const candidates: FlightCandidate[] = [];

  for (const offers of offerLists) {
    for (const offer of offers) {
      const key = dedupeKeyForOffer(offer);
      if (seen.has(key)) continue;
      seen.add(key);

      const candidate = offerToCandidate(offer, params, marker, sourceId, sourceName);
      if (candidate) candidates.push(candidate);
    }
  }

  return candidates;
}

export class AviasalesAdapter implements FlightDataAdapter {
  readonly id = SOURCE_ID;
  readonly name = SOURCE_NAME;

  getStatus(): DataSourceInfo {
    const token = getToken();
    if (!token) {
      return {
        id: this.id,
        name: this.name,
        status: "unconfigured",
        note: "環境変数 TRAVELPAYOUTS_TOKEN が設定されていません。Travelpayoutsの無料アカウントで取得したトークンを設定してください。",
      };
    }
    return {
      id: this.id,
      name: this.name,
      status: "available",
      note: "キャッシュされた参考価格(/v1/prices/cheap)と、検索価格(/aviasales/v3/prices_for_dates)を提供します。実際の予約可能性・在庫は提供されないため、予約先サイトで必ずご確認ください。",
    };
  }

  async exploreDestinations(params: ExploreParams): Promise<ExploreResult> {
    const token = getToken();
    if (!token) {
      return { destinations: [], info: this.getStatus() };
    }

    const departMonth = params.flex.departDate.slice(0, 7);
    const url = new URL(`${API_BASE}/v1/prices/cheap`);
    url.searchParams.set("origin", params.originIata);
    url.searchParams.set("depart_date", departMonth);
    url.searchParams.set("currency", params.currency);
    url.searchParams.set("token", token);

    try {
      const raw = await callJson(url.toString());
      const parsed = cheapResponseSchema.safeParse(raw);
      if (!parsed.success || !parsed.data.data) {
        return {
          destinations: [],
          info: {
            id: this.id,
            name: this.name,
            status: "temporary_error",
            note: "Aviasales APIのレスポンス形式を解釈できませんでした。",
          },
        };
      }

      const destinations: DestinationSummary[] = [];
      for (const [destinationIata, node] of Object.entries(parsed.data.data)) {
        const leaves = collectLeaves(node);
        if (leaves.length === 0) continue;
        const cheapest = leaves.reduce((min, leaf) => (leaf.price! < min.price! ? leaf : min));
        const worldInfo = lookupWorldAirport(destinationIata);

        destinations.push({
          destinationIata,
          destinationCity: worldInfo?.city ?? destinationIata,
          destinationCountry: worldInfo?.country ?? "未確認",
          cheapestPrice: cheapest.price ?? null,
          currency: parsed.data.currency ?? params.currency,
          priceState: "reference",
          originIata: params.originIata,
          fetchedAt: cheapest.found_at ?? new Date().toISOString(),
          dataSourceName: this.name,
          isCached: true,
        });
      }

      destinations.sort((a, b) => (a.cheapestPrice ?? Infinity) - (b.cheapestPrice ?? Infinity));

      return {
        destinations,
        info: {
          id: this.id,
          name: this.name,
          status: "available",
          note: "広域探索の価格はすべて参考価格(キャッシュ)です。実際に予約可能な価格は詳細検索でご確認ください。",
        },
      };
    } catch (error) {
      return {
        destinations: [],
        info: {
          id: this.id,
          name: this.name,
          status: error instanceof RateLimitError ? "rate_limited" : "temporary_error",
          note: error instanceof Error ? error.message : "不明なエラーが発生しました。",
        },
      };
    }
  }

  async searchDetail(params: DetailParams): Promise<DetailResult> {
    const token = getToken();
    if (!token) {
      return { candidates: [], info: this.getStatus() };
    }

    const candidateDates = generateDateCandidates(params.flex).slice(0, params.maxDateCandidates);
    const marker = getMarker();

    let hadError = false;
    let hadRateLimit = false;

    const queryPricesForDates = async (departureAt: string, returnAt: string) => {
      const url = new URL(`${API_BASE}/aviasales/v3/prices_for_dates`);
      url.searchParams.set("origin", params.originIata);
      url.searchParams.set("destination", params.destinationIata);
      url.searchParams.set("departure_at", departureAt);
      url.searchParams.set("return_at", returnAt);
      url.searchParams.set("one_way", "false");
      url.searchParams.set("direct", "false");
      url.searchParams.set("sorting", "price");
      url.searchParams.set("currency", params.currency);
      url.searchParams.set("limit", "10");
      url.searchParams.set("token", token);

      const raw = await callJson(url.toString());
      const parsed = pricesForDatesResponseSchema.safeParse(raw);
      if (!parsed.success || !parsed.data.data) return [];
      return parsed.data.data;
    };

    const results = await mapWithConcurrencyLimit(candidateDates, MAX_CONCURRENT_REQUESTS, async (dateCandidate) => {
      try {
        const exact = await queryPricesForDates(dateCandidate.departDate, dateCandidate.returnDate);
        if (exact.length > 0) return exact;

        // 完全一致する日付のキャッシュが無い場合は、同じ月単位で再検索する。
        // キャッシュベースのAPIは完全一致の網羅性が低いため、月単位の方が結果を得やすい。
        // 実際に採用される日程は、APIが返した実際のdeparture_at/return_atから算出するため、
        // この代替検索を行っても当初日程との差分表示が不正確になることはない。
        return await queryPricesForDates(dateCandidate.departDate.slice(0, 7), dateCandidate.returnDate.slice(0, 7));
      } catch (error) {
        if (error instanceof RateLimitError) hadRateLimit = true;
        else hadError = true;
        return [];
      }
    });

    const candidates = dedupeAndConvertOffers(results, params, marker, this.id, this.name);
    candidates.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

    const status = hadRateLimit ? "rate_limited" : hadError ? "temporary_error" : "available";

    return {
      candidates,
      info: {
        id: this.id,
        name: this.name,
        status,
        note:
          status === "available"
            ? "表示価格はキャッシュされた検索価格です。リアルタイムの在庫再確認APIは提供されていないため、予約直前の価格再確認は実施できません。予約先サイトで最新価格を必ずご確認ください。"
            : "一部の日程候補の検索に失敗しました。取得できた範囲のみを表示しています。",
      },
    };
  }
}
