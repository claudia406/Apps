"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // オフライン基盤が使えなくてもアプリ本体の利用は継続できるため、登録失敗は致命的エラーにしない
    });
  }, []);

  return null;
}
