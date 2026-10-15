import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "どこかへ行きたい - 世界の往復航空券検索",
  description: "出発日・帰国日を指定するだけで、日本全国の空港発で世界中の往復航空券を比較検索できるアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
