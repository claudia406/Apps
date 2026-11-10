import { listMonthRecords } from "@/lib/studyRecords";
import { withApiErrorHandling } from "@/lib/apiHelpers";
import { daysInMonth, startOfMonth, addDays } from "@/lib/date";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return withApiErrorHandling(async () => {
    const url = new URL(request.url);
    const yearMonth = url.searchParams.get("ym");
    if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) {
      throw new Error("年月の指定が正しくありません (例: 2026-11)");
    }

    const map = await listMonthRecords(yearMonth);
    const total = daysInMonth(yearMonth);
    const start = startOfMonth(yearMonth);
    const days = Array.from({ length: total }, (_, i) => {
      const date = addDays(start, i);
      return { date, minutes: map.get(date) ?? 0 };
    });

    return { yearMonth, days };
  });
}
