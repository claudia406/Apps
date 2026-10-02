"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { newPasswordSchema } from "@/lib/validation";

type Status = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function prepareSession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setStatus("invalid");
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      setStatus(data.session ? "ready" : "invalid");
    }

    prepareSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsed = newPasswordSchema.safeParse({
      newPassword: formData.get("newPassword"),
      newPasswordConfirm: formData.get("newPasswordConfirm"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "入力内容を確認してください。");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.newPassword,
    });

    setSubmitting(false);

    if (updateError) {
      setError("パスワードの更新に失敗しました。もう一度お試しください。");
      return;
    }

    setStatus("done");
    setTimeout(() => router.replace("/login"), 2000);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div className="card" style={{ maxWidth: 400 }}>
        <h1 style={{ fontSize: 20 }}>新しいパスワードの設定</h1>

        {status === "checking" && <p className="help-text">確認中です...</p>}

        {status === "invalid" && (
          <div className="banner banner-error">
            リンクが無効または期限切れです。パスワード再設定を再度ご依頼ください。
          </div>
        )}

        {status === "done" && (
          <div className="banner banner-success">
            パスワードを更新しました。ログイン画面に移動します。
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit}>
            {error && <div className="banner banner-error">{error}</div>}

            <div className="field">
              <label htmlFor="newPassword">新しいパスワード(8文字以上)</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="newPasswordConfirm">新しいパスワード(確認)</label>
              <input
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                type="password"
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
              {submitting ? "更新中..." : "パスワードを更新"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
