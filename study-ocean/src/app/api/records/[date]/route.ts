import { getRecord, setMinutesForDate, isAchieved } from "@/lib/studyRecords";
import { setMinutesSchema } from "@/lib/validation";
import { withApiErrorHandling } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ date: string }> }) {
  return withApiErrorHandling(async () => {
    const { date } = await params;
    const minutes = await getRecord(date);
    return { date, minutes, achieved: isAchieved(minutes) };
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ date: string }> }) {
  return withApiErrorHandling(async () => {
    const { date } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = setMinutesSchema.parse({ date, totalMinutes: body.totalMinutes });
    const minutes = await setMinutesForDate(parsed.date, parsed.totalMinutes);
    return { date, minutes, achieved: isAchieved(minutes) };
  });
}
