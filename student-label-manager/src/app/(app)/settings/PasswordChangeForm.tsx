"use client";

import { useActionState } from "react";
import { changePasswordAction, type PasswordChangeState } from "./actions";

const initialState: PasswordChangeState = { error: null, success: false };

export default function PasswordChangeForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="card" style={{ maxWidth: 420 }}>
      <h2 style={{ fontSize: 16 }}>パスワード変更</h2>

      {state.error && <div className="banner banner-error">{state.error}</div>}
      {state.success && <div className="banner banner-success">パスワードを変更しました。</div>}

      <div className="field">
        <label htmlFor="currentPassword">現在のパスワード</label>
        <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
      </div>

      <div className="field">
        <label htmlFor="newPassword">新しいパスワード(8文字以上)</label>
        <input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
      </div>

      <div className="field">
        <label htmlFor="newPasswordConfirm">新しいパスワード(確認)</label>
        <input
          id="newPasswordConfirm"
          name="newPasswordConfirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? "変更中..." : "パスワードを変更"}
      </button>
    </form>
  );
}
