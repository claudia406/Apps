export function formatPrice(price: number | null, currency: string | null): string {
  if (price === null || currency === null) return "価格未確認";
  try {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price.toLocaleString("ja-JP")} ${currency.toUpperCase()}`;
  }
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "未確認";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}時間${mins}分`;
}

export function formatDiffDays(diff: number): string {
  if (diff === 0) return "当初日程どおり";
  return diff > 0 ? `${diff}日後ろ倒し` : `${Math.abs(diff)}日前倒し`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP");
}
