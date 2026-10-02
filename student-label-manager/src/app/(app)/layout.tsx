import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import IdleLogout from "@/components/IdleLogout";
import { logoutAction } from "./logout-action";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <IdleLogout />
      <header
        className="no-print"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid var(--color-border)",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/dashboard" style={{ fontWeight: 600, color: "var(--color-text)" }}>
            生徒情報データベース
          </Link>
          <Link href="/students">生徒検索</Link>
          <Link href="/students/new">新規登録</Link>
          <Link href="/students/trash">ゴミ箱</Link>
          <Link href="/settings">設定</Link>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="help-text">{user.email}</span>
          <form action={logoutAction}>
            <button type="submit" className="btn">
              ログアウト
            </button>
          </form>
        </div>
      </header>
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}
