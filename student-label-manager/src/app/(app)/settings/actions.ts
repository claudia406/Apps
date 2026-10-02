"use server";

import { createClient } from "@/lib/supabase/server";
import { passwordChangeSchema } from "@/lib/validation";

export interface PasswordChangeState {
  error: string | null;
  success: boolean;
}

export async function changePasswordAction(
  _prev: PasswordChangeState,
  formData: FormData
): Promise<PasswordChangeState> {
  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    newPasswordConfirm: formData.get("newPasswordConfirm"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。", success: false };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;

  if (!email) {
    return { error: "セッションが無効です。再度ログインしてください。", success: false };
  }

  // 現在のパスワードの検証(再認証)
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    return { error: "現在のパスワードが正しくありません。", success: false };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) {
    return { error: "パスワードの更新に失敗しました。もう一度お試しください。", success: false };
  }

  return { error: null, success: true };
}
