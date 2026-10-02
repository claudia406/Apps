"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Student } from "@/types/student";
import { LABEL_SHEET, LABEL_COUNT } from "@/lib/constants";
import styles from "./print.module.css";

const OFFSET_STORAGE_KEY = "label-print-offset-mm";

interface Offset {
  x: number;
  y: number;
}

function loadOffset(): Offset {
  try {
    const raw = window.localStorage.getItem(OFFSET_STORAGE_KEY);
    if (!raw) return { x: 0, y: 0 };
    const parsed = JSON.parse(raw);
    return { x: Number(parsed.x) || 0, y: Number(parsed.y) || 0 };
  } catch {
    return { x: 0, y: 0 };
  }
}

function saveOffset(offset: Offset) {
  try {
    window.localStorage.setItem(OFFSET_STORAGE_KEY, JSON.stringify(offset));
  } catch {
    // ブラウザのストレージが利用できない場合は無視(この回の印刷には影響しない)
  }
}

function labelNameLine(student: Student): string {
  const name = student.full_name.trim();
  return name ? `${name} 様` : "(氏名未登録)";
}

export default function PrintFlow({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [positions, setPositions] = useState<(string | null)[]>(() => {
    const arr: (string | null)[] = new Array(LABEL_COUNT).fill(null);
    initialStudents.forEach((s, i) => {
      if (i < LABEL_COUNT) arr[i] = s.id;
    });
    return arr;
  });
  const [guardianVisible, setGuardianVisible] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

  useEffect(() => {
    // localStorage はサーバー側で読めないため、ハイドレーション不整合を避けてマウント後に読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffset(loadOffset());
  }, []);

  function updateOffset(next: Partial<Offset>) {
    setOffset((prev) => {
      const merged = { ...prev, ...next };
      saveOffset(merged);
      return merged;
    });
  }

  function removeStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setPositions((prev) => prev.map((p) => (p === id ? null : p)));
  }

  function assign(positionIndex: number, studentId: string) {
    setPositions((prev) => {
      const next = prev.map((p) => (p === studentId ? null : p));
      next[positionIndex] = studentId || null;
      return next;
    });
  }

  const studentsById = new Map(students.map((s) => [s.id, s]));

  return (
    <div>
      <div className="no-print">
      <div className={styles.selectedPanel}>
        <div className="card">
          <h2 style={{ fontSize: 15, marginBottom: 8 }}>印刷対象（{students.length}名）</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {students.map((s) => (
              <span
                key={s.id}
                className="status-badge status-active"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {s.full_name || "(未入力)"}
                <button
                  type="button"
                  onClick={() => removeStudent(s.id)}
                  aria-label={`${s.full_name || "この生徒"}を印刷対象から外す`}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "var(--color-danger)",
                    fontWeight: 700,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 0 }}>
          <input
            type="checkbox"
            checked={guardianVisible}
            onChange={(e) => setGuardianVisible(e.target.checked)}
          />
          保護者様を表示する
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 0 }}>
          <input type="checkbox" checked={testMode} onChange={(e) => setTestMode(e.target.checked)} />
          テスト印刷モード（位置番号のみ表示）
        </label>

        <div className={styles.calibration}>
          <span className="help-text">印刷位置調整:</span>
          <label style={{ margin: 0 }}>左右(mm)</label>
          <input
            type="number"
            step={0.1}
            value={offset.x}
            onChange={(e) => updateOffset({ x: Number(e.target.value) })}
          />
          <label style={{ margin: 0 }}>上下(mm)</label>
          <input
            type="number"
            step={0.1}
            value={offset.y}
            onChange={(e) => updateOffset({ y: Number(e.target.value) })}
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          印刷
        </button>

        <Link href="/students" className="btn">
          対象を選び直す
        </Link>
      </div>

      <p className="help-text" style={{ marginBottom: 12 }}>
        初回印刷時は「テスト印刷モード」で実際のラベル用紙に試し印刷し、ずれがあれば印刷位置調整で補正してください。
        ブラウザの印刷設定では「実際のサイズ」または倍率100%を選択してください。
      </p>

      <div className={styles.positionGrid}>
        {positions.map((studentId, idx) => (
          <div key={idx} className={styles.positionCell}>
            <label>位置 {idx + 1}</label>
            <select value={studentId ?? ""} onChange={(e) => assign(idx, e.target.value)}>
              <option value="">（空き）</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name || "(未入力)"}
                  {s.school_name ? ` / ${s.school_name}` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      </div>

      <div className={styles.sheetWrapper}>
        <div
          className={styles.sheet}
          style={
            {
              "--offset-x": `${offset.x}mm`,
              "--offset-y": `${offset.y}mm`,
            } as React.CSSProperties
          }
        >
          {Array.from({ length: LABEL_COUNT }, (_, idx) => {
            const studentId = positions[idx];
            const student = studentId ? studentsById.get(studentId) : undefined;

            return (
              <div key={idx} className={styles.cell}>
                {testMode ? (
                  <p className={styles.testLabel}>位置 {idx + 1}</p>
                ) : student ? (
                  <>
                    <p className={styles.cellName}>{labelNameLine(student)}</p>
                    {guardianVisible && <p className={styles.cellGuardian}>保護者様</p>}
                    {(student.postal_code || student.address) && (
                      <p className={styles.cellAddress}>
                        {student.postal_code ? `〒${student.postal_code}\n` : ""}
                        {student.address}
                      </p>
                    )}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <p className="help-text no-print" style={{ marginTop: 8 }}>
        用紙: F21A4-2 / A4 / {LABEL_SHEET.columns}列×{LABEL_SHEET.rows}行 / 1片 {LABEL_SHEET.labelWidthMm}
        mm×{LABEL_SHEET.labelHeightMm}mm
      </p>
    </div>
  );
}
