import { describe, expect, it } from "vitest";
import { JAPAN_AIRPORTS, MAJOR_INTERNATIONAL_AIRPORTS, findAirport } from "../airports";

describe("JAPAN_AIRPORTS", () => {
  it("IATAコードはすべて重複しない", () => {
    const codes = JAPAN_AIRPORTS.map((a) => a.iata);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("すべてのIATAコードは3文字の英大文字である", () => {
    for (const airport of JAPAN_AIRPORTS) {
      expect(airport.iata).toMatch(/^[A-Z]{3}$/);
    }
  });

  it("すべての空港に名称・都市名・地域が設定されている", () => {
    for (const airport of JAPAN_AIRPORTS) {
      expect(airport.name.length).toBeGreaterThan(0);
      expect(airport.city.length).toBeGreaterThan(0);
      expect(airport.region.length).toBeGreaterThan(0);
    }
  });

  it("主要国際空港はすべてマスターデータに含まれる", () => {
    for (const iata of MAJOR_INTERNATIONAL_AIRPORTS) {
      expect(findAirport(iata)).toBeDefined();
    }
  });

  it("findAirportは小文字でも検索できる", () => {
    expect(findAirport("hnd")?.iata).toBe("HND");
  });

  it("存在しないコードはundefinedを返す(架空の空港を作らない)", () => {
    expect(findAirport("ZZZ")).toBeUndefined();
  });
});
