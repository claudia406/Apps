import { requireUser } from "@/lib/auth-guard";
import PasswordChangeForm from "./PasswordChangeForm";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", display: "grid", gap: 20 }}>
      <h1 style={{ fontSize: 18 }}>管理者設定</h1>
      <div className="card">
        <h2 style={{ fontSize: 16 }}>管理者情報</h2>
        <p className="help-text">メールアドレス: {user.email}</p>
      </div>
      <PasswordChangeForm />
    </div>
  );
}
