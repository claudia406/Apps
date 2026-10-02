import { createAdminClient } from "@/lib/supabase/admin";
import { LOGIN_LOCKOUT_WINDOW_MINUTES, LOGIN_MAX_ATTEMPTS } from "@/lib/constants";

/** 直近のウィンドウ内での失敗回数が上限に達している場合 true を返す */
export async function isLoginLocked(email: string): Promise<boolean> {
  const admin = createAdminClient();
  const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count, error } = await admin
    .from("login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("email", email.toLowerCase())
    .eq("success", false)
    .gte("created_at", since);

  if (error) {
    // 記録系の障害でログイン自体を止めない(ログだけ残す)
    console.error("isLoginLocked error", error);
    return false;
  }

  return (count ?? 0) >= LOGIN_MAX_ATTEMPTS;
}

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ip: string | null
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("login_attempts")
    .insert({ email: email.toLowerCase(), success, ip });

  if (error) {
    console.error("recordLoginAttempt error", error);
  }
}
