import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AviasalesAdapter, dedupeAndConvertOffers, dedupeKeyForOffer, offerToCandidate } from "../adapters/aviasales";
import { DuffelAdapter } from "../adapters/duffel";
import { SkyscannerAdapter } from "../adapters/skyscanner";
import type { DateFlexibility, PassengerConditions } from "../types";

const flex: DateFlexibility = { departDate: "2026-12-01", returnDate: "2026-12-08", departFlexDays: 3, returnFlexDays: 3 };
const passengers: PassengerConditions = { adults: 1, cabinClass: "economy", checkedBaggage: "unspecified" };
const baseParams = {
  originIata: "HND",
  destinationIata: "SIN",
  destinationCity: "シンガポール",
  destinationCountry: "シンガポール",
  flex,
  passengers,
  currency: "jpy",
};

describe("offerToCandidate", () => {
  it("価格・日程が揃ったオファーをFlightCandidateに変換する", () => {
    const candidate = offerToCandidate(
      {
        price: 45000,
        airline: "SQ",
        flight_number: "637",
        departure_at: "2026-12-02T10:00:00",
        return_at: "2026-12-09T13:00:00",
        transfers: 0,
        return_transfers: 0,
        duration: 420,
        link: "/search/HNDSIN",
        found_at: "2026-10-01T00:00:00Z",
      },
      baseParams,
      "marker1",
      "aviasales",
      "Aviasales Data API",
    );

    expect(candidate).not.toBeNull();
    expect(candidate?.price).toBe(45000);
    expect(candidate?.airline).toBe("SQ");
    expect(candidate?.bookingLink.url).toContain("marker=marker1");
    expect(candidate?.resolvedDates.actualDepartDate).toBe("2026-12-02");
    expect(candidate?.withinRequestedFlexibility).toBe(true);
  });

  it("指定した柔軟性(前後3日)の範囲外の日程はwithinRequestedFlexibility=falseになる(範囲外を隠して提示しない)", () => {
    const candidate = offerToCandidate(
      { price: 58446, airline: "CZ", departure_at: "2026-12-10T15:05:00+09:00", return_at: "2026-12-16T19:55:00+07:00" },
      baseParams,
      undefined,
      "aviasales",
      "Aviasales Data API",
    );
    expect(candidate?.withinRequestedFlexibility).toBe(false);
  });

  it("滞在日数の下限・上限を外れる場合もwithinRequestedFlexibility=falseになる", () => {
    const candidate = offerToCandidate(
      { price: 10000, departure_at: "2026-12-02T00:00:00", return_at: "2026-12-03T00:00:00" },
      { ...baseParams, flex: { ...flex, minStayDays: 5 } },
      undefined,
      "aviasales",
      "Aviasales Data API",
    );
    expect(candidate?.withinRequestedFlexibility).toBe(false);
  });

  it("価格が欠けているオファーは推測で埋めずnullを返す", () => {
    const candidate = offerToCandidate(
      { airline: "SQ", departure_at: "2026-12-02", return_at: "2026-12-09" },
      baseParams,
      undefined,
      "aviasales",
      "Aviasales Data API",
    );
    expect(candidate).toBeNull();
  });

  it("出発日が欠けているオファーはnullを返す", () => {
    const candidate = offerToCandidate(
      { price: 1000, return_at: "2026-12-09" },
      baseParams,
      undefined,
      "aviasales",
      "Aviasales Data API",
    );
    expect(candidate).toBeNull();
  });

  it("航空会社・乗継回数・所要時間が未確認の場合はnullではなくnull値のフィールドとして表現する", () => {
    const candidate = offerToCandidate(
      { price: 1000, departure_at: "2026-12-02", return_at: "2026-12-09" },
      baseParams,
      undefined,
      "aviasales",
      "Aviasales Data API",
    );
    expect(candidate?.airline).toBeNull();
    expect(candidate?.transfers).toBeNull();
    expect(candidate?.durationMinutes).toBeNull();
  });
});

describe("dedupeKeyForOffer / dedupeAndConvertOffers", () => {
  it("同じ航空会社・フライト番号・日時・価格のオファーは重複として除去する", () => {
    const offer = { price: 1000, airline: "SQ", flight_number: "1", departure_at: "2026-12-02", return_at: "2026-12-09" };
    const candidates = dedupeAndConvertOffers([[offer], [offer]], baseParams, undefined, "aviasales", "Aviasales");
    expect(candidates).toHaveLength(1);
  });

  it("価格や販売条件が異なる同一旅程は別候補として残す", () => {
    const offerA = { price: 1000, airline: "SQ", flight_number: "1", departure_at: "2026-12-02", return_at: "2026-12-09" };
    const offerB = { price: 1200, airline: "SQ", flight_number: "1", departure_at: "2026-12-02", return_at: "2026-12-09" };
    const candidates = dedupeAndConvertOffers([[offerA, offerB]], baseParams, undefined, "aviasales", "Aviasales");
    expect(candidates).toHaveLength(2);
  });

  it("同一のキー生成は安定している", () => {
    const offer = { price: 1000, airline: "SQ", flight_number: "1", departure_at: "2026-12-02", return_at: "2026-12-09" };
    expect(dedupeKeyForOffer(offer)).toBe(dedupeKeyForOffer({ ...offer }));
  });
});

describe("AviasalesAdapter", () => {
  const originalToken = process.env.TRAVELPAYOUTS_TOKEN;

  beforeEach(() => {
    delete process.env.TRAVELPAYOUTS_TOKEN;
  });

  afterEach(() => {
    if (originalToken) process.env.TRAVELPAYOUTS_TOKEN = originalToken;
    else delete process.env.TRAVELPAYOUTS_TOKEN;
  });

  it("トークン未設定の場合はunconfigured状態を返し、架空の検索結果を返さない", async () => {
    const adapter = new AviasalesAdapter();
    expect(adapter.getStatus().status).toBe("unconfigured");

    const explore = await adapter.exploreDestinations({ originIata: "HND", flex, currency: "jpy" });
    expect(explore.destinations).toEqual([]);
    expect(explore.info.status).toBe("unconfigured");

    const detail = await adapter.searchDetail({ ...baseParams, maxDateCandidates: 3 });
    expect(detail.candidates).toEqual([]);
    expect(detail.info.status).toBe("unconfigured");
  });

  it("トークンを設定してもgetStatus()のnoteにトークン自体は含まれない(漏えい防止)", () => {
    process.env.TRAVELPAYOUTS_TOKEN = "super-secret-token-value";
    const adapter = new AviasalesAdapter();
    const status = adapter.getStatus();
    expect(status.note).not.toContain("super-secret-token-value");
  });
});

describe("未接続データソースのアダプター(Duffel / Skyscanner)", () => {
  it("Duffelは常にpending_applicationを返し、架空の検索結果を返さない", async () => {
    const adapter = new DuffelAdapter();
    expect(adapter.getStatus().status).toBe("pending_application");
    const explore = await adapter.exploreDestinations({ originIata: "HND", flex, currency: "jpy" });
    expect(explore.destinations).toEqual([]);
    const detail = await adapter.searchDetail({ ...baseParams, maxDateCandidates: 3 });
    expect(detail.candidates).toEqual([]);
  });

  it("Skyscannerは常にpending_applicationを返し、架空の検索結果を返さない", async () => {
    const adapter = new SkyscannerAdapter();
    expect(adapter.getStatus().status).toBe("pending_application");
    const explore = await adapter.exploreDestinations({ originIata: "HND", flex, currency: "jpy" });
    expect(explore.destinations).toEqual([]);
    const detail = await adapter.searchDetail({ ...baseParams, maxDateCandidates: 3 });
    expect(detail.candidates).toEqual([]);
  });
});
