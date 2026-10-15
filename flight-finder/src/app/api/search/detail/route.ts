import { NextResponse } from "next/server";
import { ADAPTERS } from "@/lib/adapters/registry";
import { detailRequestSchema } from "@/lib/requestSchemas";
import type { FlightCandidate, SearchMeta } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディがJSON形式ではありません" }, { status: 400 });
  }

  const parsed = detailRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容が不正です", details: parsed.error.flatten() }, { status: 400 });
  }

  const { originIata, destinationIata, destinationCity, destinationCountry, flex, passengers, currency, maxDateCandidates } =
    parsed.data;

  const adapterResults = await Promise.all(
    ADAPTERS.map(async (adapter) => {
      const status = adapter.getStatus();
      if (status.status !== "available") {
        return { candidates: [] as FlightCandidate[], info: status };
      }
      try {
        return await adapter.searchDetail({
          originIata,
          destinationIata,
          destinationCity,
          destinationCountry,
          flex,
          passengers,
          currency,
          maxDateCandidates,
        });
      } catch (error) {
        return {
          candidates: [] as FlightCandidate[],
          info: { ...status, status: "temporary_error" as const, note: error instanceof Error ? error.message : "不明なエラー" },
        };
      }
    }),
  );

  const candidates = adapterResults.flatMap((result) => result.candidates);
  candidates.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

  const meta: SearchMeta = {
    sources: adapterResults.map((result) => result.info),
    progress: {
      totalPlannedQueries: ADAPTERS.length,
      completedQueries: adapterResults.filter((r) => r.info.status === "available").length,
      failedQueries: adapterResults.filter((r) => r.info.status === "temporary_error" || r.info.status === "rate_limited").length,
      truncatedByLimit: false,
      limitNote: null,
    },
    searchedAt: new Date().toISOString(),
  };

  return NextResponse.json({ candidates, meta });
}
