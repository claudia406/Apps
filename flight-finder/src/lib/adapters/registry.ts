import { AviasalesAdapter } from "./aviasales";
import { DuffelAdapter } from "./duffel";
import { SkyscannerAdapter } from "./skyscanner";
import type { FlightDataAdapter } from "./types";

/**
 * 接続済み・未接続を含むすべてのデータソースアダプターの一覧。
 * 新しいデータソースを追加する場合は、FlightDataAdapterを実装してここに追加するだけでよい。
 */
export const ADAPTERS: FlightDataAdapter[] = [new AviasalesAdapter(), new DuffelAdapter(), new SkyscannerAdapter()];

export function getConnectedAdapters(): FlightDataAdapter[] {
  return ADAPTERS.filter((adapter) => adapter.getStatus().status === "available");
}
