import { getCurrentOceanState } from "@/lib/oceanState";
import { nextUnlock } from "@/lib/oceanContent";
import { withApiErrorHandling } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

export async function GET() {
  return withApiErrorHandling(async () => {
    const { state, newlyUnlockedIds } = await getCurrentOceanState();
    return {
      state,
      newlyUnlockedIds,
      nextUnlock: nextUnlock(state.streakCurrent),
    };
  });
}
