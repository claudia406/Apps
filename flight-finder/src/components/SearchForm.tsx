"use client";

import { useId, useMemo, useState } from "react";
import { JAPAN_AIRPORTS, REGION_LABELS, type JapanRegion } from "@/lib/airports";
import type { DateFlexibility } from "@/lib/types";

export type SearchFormValues = {
  originIata: string;
  flex: DateFlexibility;
};

function todayPlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const REGION_ORDER: JapanRegion[] = ["hokkaido", "tohoku", "kanto", "chubu", "kinki", "chugoku", "shikoku", "kyushu", "okinawa"];

export function SearchForm({ onSubmit, isLoading }: { onSubmit: (values: SearchFormValues) => void; isLoading: boolean }) {
  const formId = useId();
  const [originIata, setOriginIata] = useState("HND");
  const [departDate, setDepartDate] = useState(todayPlusDays(30));
  const [returnDate, setReturnDate] = useState(todayPlusDays(37));
  const [departFlexDays, setDepartFlexDays] = useState(3);
  const [returnFlexDays, setReturnFlexDays] = useState(3);
  const [useStayRange, setUseStayRange] = useState(false);
  const [minStayDays, setMinStayDays] = useState(5);
  const [maxStayDays, setMaxStayDays] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const airportsByRegion = useMemo(() => {
    const map = new Map<JapanRegion, typeof JAPAN_AIRPORTS>();
    for (const region of REGION_ORDER) {
      map.set(region, JAPAN_AIRPORTS.filter((airport) => airport.region === region));
    }
    return map;
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!departDate || !returnDate) {
      setError("出発日と帰国日を指定してください。");
      return;
    }
    if (departDate >= returnDate) {
      setError("帰国日は出発日より後の日付を指定してください。");
      return;
    }

    onSubmit({
      originIata,
      flex: {
        departDate,
        returnDate,
        departFlexDays,
        returnFlexDays,
        minStayDays: useStayRange ? minStayDays : undefined,
        maxStayDays: useStayRange ? maxStayDays : undefined,
      },
    });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field-grid">
        <div className="field">
          <label htmlFor={`${formId}-origin`}>出発空港</label>
          <select
            id={`${formId}-origin`}
            className="select"
            value={originIata}
            onChange={(event) => setOriginIata(event.target.value)}
          >
            {REGION_ORDER.map((region) => (
              <optgroup key={region} label={REGION_LABELS[region]}>
                {airportsByRegion.get(region)?.map((airport) => (
                  <option key={airport.iata} value={airport.iata}>
                    {airport.name}({airport.iata})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="hint">1回の検索で指定できる出発空港は1つです。APIの呼び出し回数を抑えるための仕様です。</p>
        </div>

        <div className="field">
          <label htmlFor={`${formId}-depart`}>出発日</label>
          <input
            id={`${formId}-depart`}
            className="input"
            type="date"
            value={departDate}
            min={todayPlusDays(1)}
            onChange={(event) => setDepartDate(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor={`${formId}-return`}>帰国日</label>
          <input
            id={`${formId}-return`}
            className="input"
            type="date"
            value={returnDate}
            min={departDate}
            onChange={(event) => setReturnDate(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor={`${formId}-depart-flex`}>出発日の柔軟性(前後何日まで)</label>
          <input
            id={`${formId}-depart-flex`}
            className="input"
            type="number"
            min={0}
            max={14}
            value={departFlexDays}
            onChange={(event) => setDepartFlexDays(Number(event.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor={`${formId}-return-flex`}>帰国日の柔軟性(前後何日まで)</label>
          <input
            id={`${formId}-return-flex`}
            className="input"
            type="number"
            min={0}
            max={14}
            value={returnFlexDays}
            onChange={(event) => setReturnFlexDays(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="field" style={{ marginTop: 12 }}>
        <label>
          <input type="checkbox" checked={useStayRange} onChange={(event) => setUseStayRange(event.target.checked)} />{" "}
          現地滞在日数の範囲を指定する
        </label>
        {useStayRange && (
          <div className="field-grid" style={{ marginTop: 8 }}>
            <div className="field">
              <label htmlFor={`${formId}-min-stay`}>滞在日数(下限)</label>
              <input
                id={`${formId}-min-stay`}
                className="input"
                type="number"
                min={1}
                max={90}
                value={minStayDays}
                onChange={(event) => setMinStayDays(Number(event.target.value))}
              />
            </div>
            <div className="field">
              <label htmlFor={`${formId}-max-stay`}>滞在日数(上限)</label>
              <input
                id={`${formId}-max-stay`}
                className="input"
                type="number"
                min={1}
                max={90}
                value={maxStayDays}
                onChange={(event) => setMaxStayDays(Number(event.target.value))}
              />
            </div>
          </div>
        )}
      </div>

      <p className="notice notice-info" style={{ marginTop: 12 }}>
        旅行者数・座席クラス・荷物条件: 現在接続しているデータソース(Aviasales Data API)は、大人1名・エコノミークラスの参考価格のみを提供しており、人数・クラス・荷物条件による検索条件の指定には対応していません。別のデータソースを接続した際に対応予定です。
      </p>

      {error && <p className="notice notice-danger">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: "100%", marginTop: 4 }}>
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden /> 検索中...
          </>
        ) : (
          "世界中の旅行先を検索する"
        )}
      </button>
    </form>
  );
}
