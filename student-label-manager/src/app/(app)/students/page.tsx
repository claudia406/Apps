import { searchStudents } from "@/lib/students-repo";
import StudentSearchResults from "./StudentSearchResults";

interface Props {
  searchParams: Promise<{ q?: string; archived?: string }>;
}

export default async function StudentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q ?? "";
  const includeArchived = params.archived === "1";

  const students = await searchStudents({ query, includeArchived });

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 20 }}>
      <div className="card">
        <h1 style={{ fontSize: 18 }}>生徒検索</h1>
        <form method="get" style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div className="field" style={{ flex: 1, minWidth: 240, marginBottom: 0 }}>
            <label htmlFor="q">氏名・学校名・メールアドレス</label>
            <input id="q" name="q" type="search" defaultValue={query} placeholder="例: 山田" />
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
            <input type="checkbox" name="archived" value="1" defaultChecked={includeArchived} />
            アーカイブも検索する
          </label>
          <button type="submit" className="btn btn-primary" style={{ marginBottom: 8 }}>
            検索
          </button>
        </form>
      </div>

      <StudentSearchResults students={students} />
    </div>
  );
}
