import type { DataSourceInfo } from "../types";
import type { DetailParams, DetailResult, ExploreParams, ExploreResult, FlightDataAdapter } from "./types";

const SOURCE_ID = "duffel";
const SOURCE_NAME = "Duffel Flights API";

/**
 * Duffelは「比較して外部の予約サイトへ誘導する」モデルではなく、
 * 自社APIで直接「注文(予約)」を作成する仕組みであるため、
 * 接続するとShioriさん自身が航空券を販売する立場になり、
 * 日本国内では旅行業法上の旅行業登録が必要になる可能性がある。
 * この法務上の論点はエンジニアリングで解決できないため、
 * Ownerの判断と確認が得られるまで、本アダプターは意図的に未接続のままにする。
 */
export class DuffelAdapter implements FlightDataAdapter {
  readonly id = SOURCE_ID;
  readonly name = SOURCE_NAME;

  getStatus(): DataSourceInfo {
    return {
      id: this.id,
      name: this.name,
      status: "pending_application",
      note:
        "Duffelは自社で航空券の「注文」を作成する仕組みのため、接続するとOwner様が航空券の販売者(旅行業)としての立場になる可能性があります。旅行業登録など法務面の確認が取れるまで、意図的に未接続としています。",
    };
  }

  async exploreDestinations(_params: ExploreParams): Promise<ExploreResult> {
    return { destinations: [], info: this.getStatus() };
  }

  async searchDetail(_params: DetailParams): Promise<DetailResult> {
    return { candidates: [], info: this.getStatus() };
  }
}
