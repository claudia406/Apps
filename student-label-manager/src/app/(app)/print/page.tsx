import Link from "next/link";
import { getStudentsByIds } from "@/lib/students-repo";
import PrintFlow from "./PrintFlow";
import { LABEL_COUNT } from "@/lib/constants";

interface Props {
  searchParams: Promise<{ ids?: string }>;
}

export default async function PrintPage({ searchParams }: Props) {
  const params = await searchParams;
  const ids = (params.ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, LABEL_COUNT);

  if (ids.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }} className="card">
        <p>印刷対象が選択されていません。</p>
        <Link href="/students" className="btn btn-primary">
          生徒検索に戻る
        </Link>
      </div>
    );
  }

  const students = await getStudentsByIds(ids);
  // 指定順を保持する
  const ordered = ids.map((id) => students.find((s) => s.id === id)).filter((s) => s !== undefined);

  return (
    <div>
      <h1 className="no-print" style={{ fontSize: 18, marginBottom: 16 }}>
        ラベル印刷
      </h1>
      <PrintFlow initialStudents={ordered} />
    </div>
  );
}
