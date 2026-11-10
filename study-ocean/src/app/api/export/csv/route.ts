import { getAllRecordsSorted } from "@/lib/studyRecords";
import { buildStudyRecordsCsv } from "@/lib/csv";
import { todayJST } from "@/lib/date";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await getAllRecordsSorted();
    const csv = buildStudyRecordsCsv(records);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="study-ocean_${todayJST()}.csv"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "CSVの生成に失敗しました";
    return new Response(message, { status: 500 });
  }
}
