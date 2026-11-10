import { getFullStats } from "@/lib/studyRecords";
import { withApiErrorHandling } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

export async function GET() {
  return withApiErrorHandling(async () => {
    return getFullStats();
  });
}
