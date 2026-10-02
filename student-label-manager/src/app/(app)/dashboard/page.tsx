import Link from "next/link";
import { listRecentViews } from "@/lib/students-repo";

export default async function DashboardPage() {
  const recentViews = await listRecentViews();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
      <div className="card" style={{ display: "flex", gap: 12 }}>
        <Link href="/students" className="btn btn-primary">
          生徒を検索
        </Link>
        <Link href="/students/new" className="btn">
          新規生徒登録
        </Link>
        <Link href="/students/trash" className="btn">
          ゴミ箱を見る
        </Link>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 16 }}>最近開いた生徒</h2>
        {recentViews.length === 0 ? (
          <p className="help-text">最近開いた生徒はありません。</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>氏名</th>
                <th>学校名</th>
                <th>状態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentViews.map((row) => (
                <tr key={row.student_id}>
                  <td>{row.student?.full_name || "(未入力)"}</td>
                  <td>{row.student?.school_name || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        row.student?.status === "archived" ? "status-archived" : "status-active"
                      }`}
                    >
                      {row.student?.status === "archived" ? "アーカイブ" : "現役"}
                    </span>
                  </td>
                  <td>
                    <Link href={`/students/${row.student_id}`}>開く</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
