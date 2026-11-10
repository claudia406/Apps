import { NextResponse, type NextRequest } from "next/server";

/**
 * 本人のみが使用する個人専用アプリのため、アプリ内にログイン画面は設けず、
 * Vercel/ブラウザ標準の HTTP Basic 認証でオリジン全体を保護する。
 * ユーザー名・パスワードは環境変数で設定する（セットアップ手順は README 参照）。
 * 認証情報が未設定の場合は保護をスキップしない（設定を強制する）。
 */
export function proxy(request: NextRequest): NextResponse {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  if (!user || !pass) {
    return new NextResponse("Study Ocean: BASIC_AUTH_USER / BASIC_AUTH_PASSWORD が未設定です。", {
      status: 500,
    });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const encoded = authHeader.slice("Basic ".length);
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    const suppliedUser = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : decoded;
    const suppliedPass = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : "";

    if (suppliedUser === user && suppliedPass === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("認証が必要です。", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Study Ocean", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
