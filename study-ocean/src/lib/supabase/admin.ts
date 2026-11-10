import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * service_role キーを使う管理用クライアント。
 * RLS をバイパスするため、Route Handler / Server Action からのみ import すること。
 * ブラウザ(クライアントコンポーネント)から直接 import してはならない。
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
