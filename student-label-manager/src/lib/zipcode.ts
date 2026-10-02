import { toZipcloudQuery } from "@/lib/format";

interface ZipcloudResult {
  address1: string; // 都道府県
  address2: string; // 市区町村
  address3: string; // 町域
}

interface ZipcloudResponse {
  status: number;
  results: ZipcloudResult[] | null;
  message: string | null;
}

/** 郵便番号から住所候補を取得する(zipcloud 公開API)。見つからない場合は null。 */
export async function lookupAddressByPostalCode(postalCode: string): Promise<string | null> {
  const code = toZipcloudQuery(postalCode);
  if (code.length !== 7) return null;

  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as ZipcloudResponse;
    const first = data.results?.[0];
    if (!first) return null;

    return `${first.address1}${first.address2}${first.address3}`;
  } catch (err) {
    console.error("lookupAddressByPostalCode error", err);
    return null;
  }
}
