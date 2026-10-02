import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Component / Server Action の先頭で呼び出す。
 * 未ログインの場合は /login へリダイレクトし、以降の処理(DBアクセス等)を行わせない。
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return data.user;
}

/**
 * フォーム送信やページ遷移を伴わない補助的なServer Action(重複チェック等)から呼ぶ。
 * redirect() は行わず、未ログインなら null を返すだけにする。
 */
export async function getUserOrNull() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
