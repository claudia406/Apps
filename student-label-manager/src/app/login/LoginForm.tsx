"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="card" style={{ maxWidth: 360 }}>
      <h1 style={{ fontSize: 20 }}>生徒情報データベース</h1>
      <p className="help-text" style={{ marginBottom: 20 }}>
        管理者としてログインしてください。
      </p>

      {state.error && <div className="banner banner-error">{state.error}</div>}

      <div className="field">
        <label htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="email" required autoComplete="username" autoFocus />
      </div>

      <div className="field">
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isPending}>
        {isPending ? "ログイン中..." : "ログイン"}
      </button>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link href="/forgot-password">パスワードをお忘れの場合</Link>
      </div>
    </form>
  );
}
