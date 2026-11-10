import { getMonthlyGoal, setMonthlyGoal } from "@/lib/monthlyGoals";
import { monthlyGoalSchema } from "@/lib/validation";
import { withApiErrorHandling } from "@/lib/apiHelpers";
import { yearMonthOf, todayJST } from "@/lib/date";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return withApiErrorHandling(async () => {
    const url = new URL(request.url);
    const yearMonth = url.searchParams.get("ym") ?? yearMonthOf(todayJST());
    const goalMinutes = await getMonthlyGoal(yearMonth);
    return { yearMonth, goalMinutes };
  });
}

export async function PUT(request: Request) {
  return withApiErrorHandling(async () => {
    const body = await request.json().catch(() => ({}));
    const parsed = monthlyGoalSchema.parse({
      yearMonth: body.yearMonth,
      goalMinutes: body.goalMinutes,
    });
    await setMonthlyGoal(parsed.yearMonth, parsed.goalMinutes);
    return { yearMonth: parsed.yearMonth, goalMinutes: parsed.goalMinutes };
  });
}
