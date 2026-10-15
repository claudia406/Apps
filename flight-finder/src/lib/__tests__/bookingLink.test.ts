import { describe, expect, it } from "vitest";
import { buildLinkFromApiPath, buildSearchResultsLink, isSafeExternalUrl } from "../bookingLink";

describe("isSafeExternalUrl", () => {
  const allowed = new Set(["www.aviasales.com"]);

  it("httpsかつ許可ホストのURLのみ安全と判定する", () => {
    expect(isSafeExternalUrl("https://www.aviasales.com/search/ABC", allowed)).toBe(true);
  });

  it("httpのURLは拒否する", () => {
    expect(isSafeExternalUrl("http://www.aviasales.com/search/ABC", allowed)).toBe(false);
  });

  it("許可されていないホストは拒否する(なりすまし対策)", () => {
    expect(isSafeExternalUrl("https://evil.example.com/search/ABC", allowed)).toBe(false);
  });

  it("不正なURL文字列は拒否する", () => {
    expect(isSafeExternalUrl("not a url", allowed)).toBe(false);
  });
});

describe("buildLinkFromApiPath", () => {
  it("相対パスを完全なURLに変換し、tierをapi_offer_linkにする", () => {
    const link = buildLinkFromApiPath("/search/HND0112SIN0812", "marker123");
    expect(link.tier).toBe("api_offer_link");
    expect(link.url).toBe("https://www.aviasales.com/search/HND0112SIN0812?marker=marker123");
    expect(link.isSearchResultsPage).toBe(false);
  });

  it("markerが無い場合でもURLを生成する", () => {
    const link = buildLinkFromApiPath("/search/HND0112SIN0812", undefined);
    expect(link.url).toBe("https://www.aviasales.com/search/HND0112SIN0812");
  });

  it("パスが無い場合は架空のリンクを作らずtier=noneを返す", () => {
    const link = buildLinkFromApiPath(null, "marker123");
    expect(link.tier).toBe("none");
    expect(link.url).toBeNull();
  });
});

describe("buildSearchResultsLink", () => {
  it("出発地・目的地・日程からAviasalesの検索結果URLを組み立てる", () => {
    const link = buildSearchResultsLink({
      originIata: "HND",
      destinationIata: "SIN",
      departDate: "2026-12-01",
      returnDate: "2026-12-08",
      adults: 1,
      cabinClass: "economy",
      marker: "marker123",
    });
    expect(link.tier).toBe("travel_agency_site");
    expect(link.isSearchResultsPage).toBe(true);
    expect(link.url).toBe("https://www.aviasales.com/search/HND0112SIN08121?marker=marker123");
  });

  it("必須パラメータが欠けている場合は架空のリンクを生成しない", () => {
    const link = buildSearchResultsLink({
      originIata: "",
      destinationIata: "SIN",
      departDate: "2026-12-01",
      returnDate: "2026-12-08",
      adults: 1,
      cabinClass: "economy",
      marker: undefined,
    });
    expect(link.tier).toBe("none");
    expect(link.url).toBeNull();
  });

  it("ビジネスクラスの場合はクラスコードbを付与する", () => {
    const link = buildSearchResultsLink({
      originIata: "HND",
      destinationIata: "SIN",
      departDate: "2026-12-01",
      returnDate: "2026-12-08",
      adults: 2,
      cabinClass: "business",
      marker: undefined,
    });
    expect(link.url).toBe("https://www.aviasales.com/search/HND0112SIN08122b");
  });
});
