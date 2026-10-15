import type { DataSourceInfo } from "../types";
import type { DetailParams, DetailResult, ExploreParams, ExploreResult, FlightDataAdapter } from "./types";

const SOURCE_ID = "skyscanner";
const SOURCE_NAME = "Skyscanner Flights Live Prices API";

/**
 * Skyscannerはセルフサーブ提供を行っておらず、パートナーポータルへの申請・審査(無料、約2週間)が必要。
 * 個人開発・実績のない事業者では承認されない可能性が高いため、
 * Ownerが実際に申請し承認された場合にのみ接続できるよう、アダプターの受け口のみ用意する。
 */
export class SkyscannerAdapter implements FlightDataAdapter {
  readonly id = SOURCE_ID;
  readonly name = SOURCE_NAME;

  getStatus(): DataSourceInfo {
    return {
      id: this.id,
      name: this.name,
      status: "pending_application",
      note:
        "Skyscanner Travel APIはパートナー申請制(審査約2週間、個人開発では承認されない可能性があります)です。Owner様が申請・承認された後、認証情報を設定すると接続できます。",
    };
  }

  async exploreDestinations(_params: ExploreParams): Promise<ExploreResult> {
    return { destinations: [], info: this.getStatus() };
  }

  async searchDetail(_params: DetailParams): Promise<DetailResult> {
    return { candidates: [], info: this.getStatus() };
  }
}
