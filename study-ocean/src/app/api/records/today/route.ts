import { getRecord, addMinutesToDate } from "@/lib/studyRecords";
import { todayJST } from "@/lib/date";
import { addMinutesSchema } from "@/lib/validation";
import { withApiErrorHandling } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

export async function GET() {
  return withApiErrorHandling(async () => {
    const date = todayJST();
    const minutes = await getRecord(date);
    return { date, minutes };
  });
}

export async function POST(request: Request) {
  return withApiErrorHandling(async () => {
    const date = todayJST();
    const body = await request.json().catch(() => ({}));
    const parsed = addMinutesSchema.parse({ date, deltaMinutes: body.deltaMinutes });
    const minutes = await addMinutesToDate(parsed.date, parsed.deltaMinutes);
    return { date, minutes };
  });
}
