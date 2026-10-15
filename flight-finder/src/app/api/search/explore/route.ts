import { NextResponse } from "next/server";
import { ADAPTERS } from "@/lib/adapters/registry";
import { exploreRequestSchema } from "@/lib/requestSchemas";
import type { DestinationSummary, SearchMeta } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディがJSON形式ではありません" }, { status: 400 });
  }

  const parsed = exploreRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容が不正です", details: parsed.error.flatten() }, { status: 400 });
  }

  const { originIata, flex, currency, maxDestinations } = parsed.data;

  const adapterResults = await Promise.all(
    ADAPTERS.map(async (adapter) => {
      const status = adapter.getStatus();
      if (status.status !== "available") {
        return { destinations: [] as DestinationSummary[], info: status };
      }
      try {
        return await adapter.exploreDestinations({ originIata, flex, currency });
      } catch (error) {
        return {
          destinations: [] as DestinationSummary[],
          info: { ...status, status: "temporary_error" as const, note: error instanceof Error ? error.message : "不明なエラー" },
        };
      }
    }),
  );

  const allDestinations = adapterResults.flatMap((result) => result.destinations);
  allDestinations.sort((a, b) => (a.cheapestPrice ?? Infinity) - (b.cheapestPrice ?? Infinity));

  const truncated = allDestinations.length > maxDestinations;
  const destinations = allDestinations.slice(0, maxDestinations);

  const meta: SearchMeta = {
    sources: adapterResults.map((result) => result.info),
    progress: {
      totalPlannedQueries: ADAPTERS.length,
      completedQueries: adapterResults.filter((r) => r.info.status === "available").length,
      failedQueries: adapterResults.filter((r) => r.info.status === "temporary_error" || r.info.status === "rate_limited").length,
      truncatedByLimit: truncated,
      limitNote: truncated
        ? `検索結果が上限(${maxDestinations}件)を超えたため、価格が安い順に${maxDestinations}件のみ表示しています。`
        : null,
    },
    searchedAt: new Date().toISOString(),
  };

  return NextResponse.json({ destinations, meta });
}
