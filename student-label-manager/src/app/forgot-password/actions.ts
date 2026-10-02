"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export interface ForgotPasswordState {
  error: string | null;
  sent: boolean;
}

const schema = z.string().trim().email();

export async function forgotPasswordAction(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = schema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: "メールアドレスの形式が正しくありません。", sent: false };
  }

  const headerList = await headers();
  const origin = headerList.get("origin") ?? "";

  const supabase = await createClient();
  // メール送信失敗の有無に関わらず常に同じ結果を返す(登録メールアドレスの存在を推測させない)
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/reset-password`,
  });

  return { error: null, sent: true };
}
