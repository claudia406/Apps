"use client";

import { useState } from "react";
import { SearchForm, type SearchFormValues } from "@/components/SearchForm";
import { DataSourceStatusPanel } from "@/components/DataSourceStatusPanel";
import { SearchProgressBanner } from "@/components/SearchProgressBanner";
import { DestinationList } from "@/components/DestinationList";
import { DestinationDetail } from "@/components/DestinationDetail";
import type { DestinationSummary, FlightCandidate, SearchMeta } from "@/lib/types";

type ViewState =
  | { stage: "form" }
  | { stage: "destinations"; formValues: SearchFormValues; destinations: DestinationSummary[]; meta: SearchMeta }
  | {
      stage: "detail";
      formValues: SearchFormValues;
      destinations: DestinationSummary[];
      destinationMeta: SearchMeta;
      destination: DestinationSummary;
      candidates: FlightCandidate[];
      detailMeta: SearchMeta;
    };

export default function Home() {
  const [view, setView] = useState<ViewState>({ stage: "form" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleExplore(formValues: SearchFormValues) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/search/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originIata: formValues.originIata, flex: formValues.flex, currency: "jpy" }),
      });
      if (!response.ok) {
        throw new Error("検索中にエラーが発生しました。しばらくしてから再度お試しください。");
      }
      const data = (await response.json()) as { destinations: DestinationSummary[]; meta: SearchMeta };
      setView({ stage: "destinations", formValues, destinations: data.destinations, meta: data.meta });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "不明なエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectDestination(
    destination: DestinationSummary,
    formValues: SearchFormValues,
    destinations: DestinationSummary[],
    destinationMeta: SearchMeta,
  ) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/search/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originIata: formValues.originIata,
          destinationIata: destination.destinationIata,
          destinationCity: destination.destinationCity,
          destinationCountry: destination.destinationCountry,
          flex: formValues.flex,
          passengers: { adults: 1, cabinClass: "economy", checkedBaggage: "unspecified" },
          currency: "jpy",
          maxDateCandidates: 5,
        }),
      });
      if (!response.ok) {
        throw new Error("詳細検索中にエラーが発生しました。しばらくしてから再度お試しください。");
      }
      const data = (await response.json()) as { candidates: FlightCandidate[]; meta: SearchMeta };
      setView({
        stage: "detail",
        formValues,
        destinations,
        destinationMeta,
        destination,
        candidates: data.candidates,
        detailMeta: data.meta,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "不明なエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>どこかへ行きたい</h1>
        <p>出発日・帰国日を指定するだけで、日本全国の空港発で世界中の往復航空券を比較検索できます。</p>
      </div>

      {errorMessage && <p className="notice notice-danger">{errorMessage}</p>}

      {view.stage === "form" && <SearchForm onSubmit={handleExplore} isLoading={isLoading} />}

      {view.stage === "destinations" && (
        <>
          <button className="back-link" type="button" onClick={() => setView({ stage: "form" })}>
            ← 検索条件を変更する
          </button>
          <DataSourceStatusPanel sources={view.meta.sources} />
          <SearchProgressBanner progress={view.meta.progress} searchedAt={view.meta.searchedAt} />
          <DestinationList
            destinations={view.destinations}
            onSelect={(destination) => handleSelectDestination(destination, view.formValues, view.destinations, view.meta)}
          />
          {isLoading && <p className="hint">詳細検索中...</p>}
        </>
      )}

      {view.stage === "detail" && (
        <>
          <button
            className="back-link"
            type="button"
            onClick={() =>
              setView({ stage: "destinations", formValues: view.formValues, destinations: view.destinations, meta: view.destinationMeta })
            }
          >
            ← 旅行先一覧に戻る
          </button>
          <div className="card">
            <strong style={{ fontSize: "1.1rem" }}>
              {view.destination.destinationCity} / {view.destination.destinationCountry}
            </strong>
            <p className="hint">出発地: {view.formValues.originIata}</p>
          </div>
          <DataSourceStatusPanel sources={view.detailMeta.sources} />
          <SearchProgressBanner progress={view.detailMeta.progress} searchedAt={view.detailMeta.searchedAt} />
          <DestinationDetail candidates={view.candidates} />
        </>
      )}
    </div>
  );
}
