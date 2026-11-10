import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function withApiErrorHandling<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const result = await fn();
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues[0]?.message ?? "入力内容が正しくありません";
      return jsonError(message, 400);
    }
    const message = err instanceof Error ? err.message : "予期しないエラーが発生しました";
    return jsonError(message, 500);
  }
}
