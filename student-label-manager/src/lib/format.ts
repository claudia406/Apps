// 郵便番号・電話番号の自動整形ユーティリティ。
// あくまで入力補助であり、整形後も利用者が自由に編集できる前提。

/** 全角数字・ハイフン類を半角に正規化してから数字のみを取り出す */
function toHalfWidthDigits(input: string): string {
  return input
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[^\d]/g, "");
}

/** 1000001 → 100-0001 */
export function formatPostalCode(input: string): string {
  const digits = toHalfWidthDigits(input).slice(0, 7);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

export function toZipcloudQuery(postalCode: string): string {
  return toHalfWidthDigits(postalCode);
}

/**
 * 電話番号を日本の一般的な区切りで整形する(ベストエフォート)。
 * 市外局番の桁数は地域ごとに異なり完全な判定表がないため、
 * 代表的なパターン(携帯/IP電話=11桁、東京03・大阪06=2桁局番、その他10桁=3桁局番)
 * で整形する。誤った区切りになる場合は利用者が手動で修正できる。
 */
export function formatPhoneNumber(input: string): string {
  const digits = toHalfWidthDigits(input).slice(0, 11);

  if (digits.length === 0) return "";

  if (digits.length <= 3) return digits;

  if (digits.length === 10) {
    if (digits.startsWith("03") || digits.startsWith("06")) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  // 桁数が確定しない入力中は、ハイフンなしの数字のみを返す
  return digits;
}
