"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ForgotPasswordState } from "./actions";

const initialState: ForgotPasswordState = { error: null, sent: false };

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  if (state.sent) {
    return (
      <div className="card" style={{ maxWidth: 400 }}>
        <h1 style={{ fontSize: 20 }}>メールを送信しました</h1>
        <p>
          入力されたメールアドレス宛にパスワード再設定用のリンクを送信しました。
          メールが届かない場合は、アドレスの入力内容をご確認のうえ再度お試しください。
        </p>
        <Link href="/login">ログイン画面に戻る</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="card" style={{ maxWidth: 400 }}>
      <h1 style={{ fontSize: 20 }}>パスワードの再設定</h1>
      <p className="help-text" style={{ marginBottom: 20 }}>
        登録済みのメールアドレスを入力してください。再設定用のリンクをお送りします。
      </p>

      {state.error && <div className="banner banner-error">{state.error}</div>}

      <div className="field">
        <label htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="email" required autoFocus />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isPending}>
        {isPending ? "送信中..." : "再設定メールを送信"}
      </button>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link href="/login">ログイン画面に戻る</Link>
      </div>
    </form>
  );
}
