"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Student } from "@/types/student";
import { LABEL_COUNT } from "@/lib/constants";
import { searchStudentsAction } from "./search-action";

export default function StudentSearchPanel() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [results, setResults] = useState<Student[]>([]);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);
  const [isSearching, startSearch] = useTransition();

  // 検索結果とは独立した印刷対象リスト。検索をやり直しても消えない。
  const [targets, setTargets] = useState<Map<string, Student>>(new Map());

  function runSearch(q: string, archived: boolean) {
    startSearch(async () => {
      const found = await searchStudentsAction(q, archived);
      setResults(found);
      setHasSearchedOnce(true);
    });
  }

  useEffect(() => {
    runSearch("", false);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(query, includeArchived);
  }

  function toggleTarget(student: Student) {
    setTargets((prev) => {
      const next = new Map(prev);
      if (next.has(student.id)) {
        next.delete(student.id);
        return next;
      }
      if (next.size >= LABEL_COUNT) {
        window.alert(`1回の印刷で選択できるのは最大${LABEL_COUNT}名です。`);
        return prev;
      }
      next.set(student.id, student);
      return next;
    });
  }

  function removeTarget(id: string) {
    setTargets((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

  function goToPrint() {
    if (targets.size === 0) return;
    router.push(`/print?ids=${Array.from(targets.keys()).join(",")}`);
  }

  const targetList = Array.from(targets.values());

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="card">
        <h1 style={{ fontSize: 18 }}>生徒検索</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div className="field" style={{ flex: 1, minWidth: 240, marginBottom: 0 }}>
            <label htmlFor="q">氏名・フリガナ・学校名・メールアドレス</label>
            <input
              id="q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: 山田 / ヤマダ"
            />
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
              color: "var(--color-text)",
            }}
          >
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
            />
            アーカイブも検索する
          </label>
          <button type="submit" className="btn btn-primary" style={{ marginBottom: 8 }} disabled={isSearching}>
            {isSearching ? "検索中..." : "検索"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 16 }}>検索結果（{results.length}件）</h2>
        {!hasSearchedOnce ? (
          <p className="help-text">検索中です...</p>
        ) : results.length === 0 ? (
          <p className="help-text">条件に一致する生徒が見つかりませんでした。</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 32 }}></th>
                <th>氏名</th>
                <th>フリガナ</th>
                <th>学校名</th>
                <th>メールアドレス</th>
                <th>状態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={targets.has(s.id)}
                      onChange={() => toggleTarget(s)}
                      aria-label={`${s.full_name || "(未入力)"}を印刷対象に追加`}
                    />
                  </td>
                  <td>{s.full_name || "(未入力)"}</td>
                  <td>{s.furigana || "-"}</td>
                  <td>{s.school_name || "-"}</td>
                  <td>{s.email || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        s.status === "archived" ? "status-archived" : "status-active"
                      }`}
                    >
                      {s.status === "archived" ? "アーカイブ" : "現役"}
                    </span>
                  </td>
                  <td>
                    <Link href={`/students/${s.id}`}>詳細</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <h2 style={{ fontSize: 16 }}>
            現在の印刷対象：{targets.size}名 / 最大{LABEL_COUNT}名
          </h2>
          <button type="button" className="btn btn-primary" disabled={targets.size === 0} onClick={goToPrint}>
            ラベル印刷へ
          </button>
        </div>

        {targetList.length === 0 ? (
          <p className="help-text">
            検索結果のチェックボックスで生徒を選択すると、ここに印刷対象として追加されます。何度検索し直しても、追加済みの生徒は保持されます。
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
            {targetList.map((s) => (
              <li
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: 6,
                }}
              >
                <span>
                  {s.full_name || "(未入力)"}
                  {s.school_name ? `（${s.school_name}）` : ""}
                </span>
                <button type="button" className="btn" onClick={() => removeTarget(s.id)}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
