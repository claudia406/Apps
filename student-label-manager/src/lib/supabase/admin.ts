import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// service_role キーを使う管理用クライアント。
// ログイン試行回数の記録など、未ログイン状態でも必要な処理のためだけに使う。
// サーバー側（Server Action / Route Handler）以外からは絶対に import しないこと。
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
