import type { BookingLink } from "./types";

const AVIASALES_ALLOWED_HOSTS = new Set(["www.aviasales.com", "aviasales.com"]);

/**
 * 外部予約先URLの安全性を検証する。
 * https かつ許可済みホストのみを有効とし、それ以外は安全でないURLとして拒否する。
 */
export function isSafeExternalUrl(url: string, allowedHosts: Set<string>): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && allowedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

function formatDdMm(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${day}${month}`;
}

/**
 * AviasalesのDataAPIが直接返す予約リンク(相対パス)を完全なURLに変換する。
 * これが取得できる場合は優先順位1(APIが提供する、選択した旅程に対応する予約リンク)に相当する。
 */
export function buildLinkFromApiPath(
  relativePath: string | null | undefined,
  marker: string | undefined,
): BookingLink {
  if (!relativePath) {
    return {
      tier: "none",
      url: null,
      providerName: "Aviasales",
      isSearchResultsPage: false,
      note: "データソースから該当旅程に対応する予約リンクが提供されませんでした。",
    };
  }

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  const base = `https://www.aviasales.com${path}`;
  const url = marker ? `${base}${path.includes("?") ? "&" : "?"}marker=${encodeURIComponent(marker)}` : base;

  if (!isSafeExternalUrl(url, AVIASALES_ALLOWED_HOSTS)) {
    return {
      tier: "none",
      url: null,
      providerName: "Aviasales",
      isSearchResultsPage: false,
      note: "データソースから取得したリンクの安全性を検証できなかったため、表示を見合わせました。",
    };
  }

  return {
    tier: "api_offer_link",
    url,
    providerName: "Aviasales",
    isSearchResultsPage: false,
    note: "APIが返した当該旅程に対応するリンクです。遷移後に最新価格・空席をご確認ください。",
  };
}

/**
 * 旅程(出発地・目的地・日程)から、Aviasalesの検索結果ページへのリンクを組み立てる。
 * APIが直接の予約リンクを返さない場合のフォールバックであり、
 * 遷移後は検索結果ページ(購入ページそのものではない)であることを明示する。
 */
export function buildSearchResultsLink(params: {
  originIata: string;
  destinationIata: string;
  departDate: string;
  returnDate: string;
  adults: number;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  marker: string | undefined;
}): BookingLink {
  const { originIata, destinationIata, departDate, returnDate, adults, cabinClass, marker } = params;

  if (!originIata || !destinationIata || !departDate || !returnDate) {
    return {
      tier: "none",
      url: null,
      providerName: "Aviasales",
      isSearchResultsPage: false,
      note: "旅程情報が不足しているため、リンクを生成できませんでした。",
    };
  }

  const classCode = cabinClass === "economy" ? "" : cabinClass === "business" ? "b" : cabinClass === "first" ? "f" : "y";
  const segment = `${originIata}${formatDdMm(departDate)}${destinationIata}${formatDdMm(returnDate)}${adults}${classCode}`;
  const base = `https://www.aviasales.com/search/${segment}`;
  const url = marker ? `${base}?marker=${encodeURIComponent(marker)}` : base;

  if (!isSafeExternalUrl(url, AVIASALES_ALLOWED_HOSTS)) {
    return {
      tier: "none",
      url: null,
      providerName: "Aviasales",
      isSearchResultsPage: false,
      note: "生成したリンクの安全性を検証できなかったため、表示を見合わせました。",
    };
  }

  return {
    tier: "travel_agency_site",
    url,
    providerName: "Aviasales",
    isSearchResultsPage: true,
    note: "指定した旅程の検索結果ページへのリンクです(購入ページそのものではありません)。実際の価格・空席は遷移先でご確認ください。",
  };
}
