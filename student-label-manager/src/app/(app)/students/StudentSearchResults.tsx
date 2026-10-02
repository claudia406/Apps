"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import type { Student } from "@/types/student";
import { LABEL_COUNT } from "@/lib/constants";

export default function StudentSearchResults({ students }: { students: Student[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= LABEL_COUNT) {
          window.alert(`一度に選択できるのは${LABEL_COUNT}人までです。`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }

  function goToPrint() {
    if (selected.size === 0) return;
    router.push(`/print?ids=${Array.from(selected).join(",")}`);
  }

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ fontSize: 16 }}>検索結果（{students.length}件）</h2>
        <button
          type="button"
          className="btn btn-primary"
          disabled={selected.size === 0}
          onClick={goToPrint}
        >
          選択した生徒をラベル印刷（{selected.size}/{LABEL_COUNT}）
        </button>
      </div>

      {students.length === 0 ? (
        <p className="help-text">条件に一致する生徒が見つかりませんでした。</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>氏名</th>
              <th>学校名</th>
              <th>メールアドレス</th>
              <th>状態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggle(s.id)}
                    aria-label={`${s.full_name || "(未入力)"}を選択`}
                  />
                </td>
                <td>{s.full_name || "(未入力)"}</td>
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
  );
}
