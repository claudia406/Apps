import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "生徒情報データベース",
  description: "生徒情報管理・ラベル印刷システム",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
