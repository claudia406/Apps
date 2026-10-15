// 日本国内の定期便が運航する空港のマスターデータ。
// 出典: Wikipedia "List of airports in Japan"(scheduled service 区分)をもとに、
// 現在定期旅客便の実績が確認できない空港(軍用・貨物専用など)を除外して作成。
// 全国の空港を網羅する努力はしているが、運航状況は常に変動するため「完全な網羅」は保証しない。
export type Airport = {
  iata: string;
  name: string;
  city: string;
  prefecture: string;
  region: JapanRegion;
};

export type JapanRegion =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kinki"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

export const REGION_LABELS: Record<JapanRegion, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州",
  okinawa: "沖縄",
};

export const JAPAN_AIRPORTS: Airport[] = [
  { iata: "HND", name: "東京国際空港(羽田)", city: "東京", prefecture: "東京都", region: "kanto" },
  { iata: "NRT", name: "成田国際空港", city: "成田", prefecture: "千葉県", region: "kanto" },
  { iata: "IBR", name: "茨城空港", city: "小美玉", prefecture: "茨城県", region: "kanto" },
  { iata: "HAC", name: "八丈島空港", city: "八丈町", prefecture: "東京都", region: "kanto" },
  { iata: "OIM", name: "大島空港", city: "大島町", prefecture: "東京都", region: "kanto" },
  { iata: "MYE", name: "三宅島空港", city: "三宅村", prefecture: "東京都", region: "kanto" },
  { iata: "CTS", name: "新千歳空港", city: "千歳", prefecture: "北海道", region: "hokkaido" },
  { iata: "OKD", name: "札幌飛行場(丘珠)", city: "札幌", prefecture: "北海道", region: "hokkaido" },
  { iata: "HKD", name: "函館空港", city: "函館", prefecture: "北海道", region: "hokkaido" },
  { iata: "AKJ", name: "旭川空港", city: "旭川", prefecture: "北海道", region: "hokkaido" },
  { iata: "KUH", name: "釧路空港", city: "釧路", prefecture: "北海道", region: "hokkaido" },
  { iata: "MMB", name: "女満別空港", city: "大空町", prefecture: "北海道", region: "hokkaido" },
  { iata: "OBO", name: "とかち帯広空港", city: "帯広", prefecture: "北海道", region: "hokkaido" },
  { iata: "WKJ", name: "稚内空港", city: "稚内", prefecture: "北海道", region: "hokkaido" },
  { iata: "RIS", name: "利尻空港", city: "利尻富士町", prefecture: "北海道", region: "hokkaido" },
  { iata: "MBE", name: "紋別空港", city: "紋別", prefecture: "北海道", region: "hokkaido" },
  { iata: "SHB", name: "根室中標津空港", city: "中標津", prefecture: "北海道", region: "hokkaido" },
  { iata: "OIR", name: "奥尻空港", city: "奥尻町", prefecture: "北海道", region: "hokkaido" },
  { iata: "AOJ", name: "青森空港", city: "青森", prefecture: "青森県", region: "tohoku" },
  { iata: "MSJ", name: "三沢空港", city: "三沢", prefecture: "青森県", region: "tohoku" },
  { iata: "AXT", name: "秋田空港", city: "秋田", prefecture: "秋田県", region: "tohoku" },
  { iata: "ONJ", name: "大館能代空港", city: "北秋田", prefecture: "秋田県", region: "tohoku" },
  { iata: "SDJ", name: "仙台空港", city: "名取", prefecture: "宮城県", region: "tohoku" },
  { iata: "GAJ", name: "山形空港", city: "東根", prefecture: "山形県", region: "tohoku" },
  { iata: "SYO", name: "庄内空港", city: "酒田", prefecture: "山形県", region: "tohoku" },
  { iata: "FKS", name: "福島空港", city: "須賀川", prefecture: "福島県", region: "tohoku" },
  { iata: "HNA", name: "花巻空港", city: "花巻", prefecture: "岩手県", region: "tohoku" },
  { iata: "KIJ", name: "新潟空港", city: "新潟", prefecture: "新潟県", region: "chubu" },
  { iata: "TOY", name: "富山空港", city: "富山", prefecture: "富山県", region: "chubu" },
  { iata: "KMQ", name: "小松空港", city: "小松", prefecture: "石川県", region: "chubu" },
  { iata: "NTQ", name: "のと里山空港", city: "輪島", prefecture: "石川県", region: "chubu" },
  { iata: "FSZ", name: "静岡空港", city: "牧之原/島田", prefecture: "静岡県", region: "chubu" },
  { iata: "NGO", name: "中部国際空港(セントレア)", city: "常滑", prefecture: "愛知県", region: "chubu" },
  { iata: "MMJ", name: "松本空港", city: "松本", prefecture: "長野県", region: "chubu" },
  { iata: "ITM", name: "大阪国際空港(伊丹)", city: "豊中/池田/伊丹", prefecture: "大阪府/兵庫県", region: "kinki" },
  { iata: "KIX", name: "関西国際空港", city: "泉佐野/田尻/泉南", prefecture: "大阪府", region: "kinki" },
  { iata: "UKB", name: "神戸空港", city: "神戸", prefecture: "兵庫県", region: "kinki" },
  { iata: "TJH", name: "但馬空港", city: "豊岡", prefecture: "兵庫県", region: "kinki" },
  { iata: "SHM", name: "南紀白浜空港", city: "白浜", prefecture: "和歌山県", region: "kinki" },
  { iata: "OKJ", name: "岡山空港", city: "岡山", prefecture: "岡山県", region: "chugoku" },
  { iata: "HIJ", name: "広島空港", city: "三原", prefecture: "広島県", region: "chugoku" },
  { iata: "IWJ", name: "石見空港", city: "益田", prefecture: "島根県", region: "chugoku" },
  { iata: "IZO", name: "出雲空港", city: "出雲", prefecture: "島根県", region: "chugoku" },
  { iata: "OKI", name: "隠岐空港", city: "隠岐の島町", prefecture: "島根県", region: "chugoku" },
  { iata: "TTJ", name: "鳥取空港", city: "鳥取", prefecture: "鳥取県", region: "chugoku" },
  { iata: "YGJ", name: "米子鬼太郎空港", city: "米子", prefecture: "鳥取県", region: "chugoku" },
  { iata: "UBJ", name: "山口宇部空港", city: "宇部", prefecture: "山口県", region: "chugoku" },
  { iata: "TKS", name: "徳島阿波おどり空港", city: "松茂", prefecture: "徳島県", region: "shikoku" },
  { iata: "TAK", name: "高松空港", city: "高松", prefecture: "香川県", region: "shikoku" },
  { iata: "MYJ", name: "松山空港", city: "松山", prefecture: "愛媛県", region: "shikoku" },
  { iata: "KCZ", name: "高知龍馬空港", city: "南国", prefecture: "高知県", region: "shikoku" },
  { iata: "FUK", name: "福岡空港", city: "福岡", prefecture: "福岡県", region: "kyushu" },
  { iata: "KKJ", name: "北九州空港", city: "北九州", prefecture: "福岡県", region: "kyushu" },
  { iata: "HSG", name: "佐賀空港", city: "佐賀", prefecture: "佐賀県", region: "kyushu" },
  { iata: "NGS", name: "長崎空港", city: "大村", prefecture: "長崎県", region: "kyushu" },
  { iata: "TSJ", name: "対馬やまねこ空港", city: "対馬", prefecture: "長崎県", region: "kyushu" },
  { iata: "IKI", name: "壱岐空港", city: "壱岐", prefecture: "長崎県", region: "kyushu" },
  { iata: "FUJ", name: "福江空港(五島つばき空港)", city: "五島", prefecture: "長崎県", region: "kyushu" },
  { iata: "KMJ", name: "熊本空港", city: "益城", prefecture: "熊本県", region: "kyushu" },
  { iata: "AXJ", name: "天草空港", city: "天草", prefecture: "熊本県", region: "kyushu" },
  { iata: "OIT", name: "大分空港", city: "国東", prefecture: "大分県", region: "kyushu" },
  { iata: "KMI", name: "宮崎空港", city: "宮崎", prefecture: "宮崎県", region: "kyushu" },
  { iata: "KOJ", name: "鹿児島空港", city: "霧島", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "ASJ", name: "奄美空港", city: "奄美", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "KUM", name: "屋久島空港", city: "屋久島町", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "TNE", name: "種子島空港", city: "中種子町", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "TKN", name: "徳之島空港", city: "天城町", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "OKE", name: "沖永良部空港", city: "和泊町", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "RNJ", name: "与論空港", city: "与論町", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "KKX", name: "喜界空港", city: "喜界町", prefecture: "鹿児島県", region: "kyushu" },
  { iata: "OKA", name: "那覇空港", city: "那覇", prefecture: "沖縄県", region: "okinawa" },
  { iata: "ISG", name: "新石垣空港", city: "石垣", prefecture: "沖縄県", region: "okinawa" },
  { iata: "MMY", name: "宮古空港", city: "宮古島", prefecture: "沖縄県", region: "okinawa" },
  { iata: "SHI", name: "下地島空港", city: "宮古島", prefecture: "沖縄県", region: "okinawa" },
  { iata: "UEO", name: "久米島空港", city: "久米島町", prefecture: "沖縄県", region: "okinawa" },
  { iata: "KTD", name: "北大東空港", city: "北大東村", prefecture: "沖縄県", region: "okinawa" },
  { iata: "MMD", name: "南大東空港", city: "南大東村", prefecture: "沖縄県", region: "okinawa" },
  { iata: "OGN", name: "与那国空港", city: "与那国町", prefecture: "沖縄県", region: "okinawa" },
  { iata: "HTR", name: "波照間空港", city: "竹富町", prefecture: "沖縄県", region: "okinawa" },
  { iata: "TRA", name: "多良間空港", city: "多良間村", prefecture: "沖縄県", region: "okinawa" },
];

export function findAirport(iata: string): Airport | undefined {
  return JAPAN_AIRPORTS.find((a) => a.iata === iata.toUpperCase());
}

// 国際線が主体の主要空港(初期値として国内発の広域探索に用いる既定の起点)
export const MAJOR_INTERNATIONAL_AIRPORTS = ["HND", "NRT", "KIX", "ITM", "NGO", "FUK", "CTS", "OKA"] as const;
