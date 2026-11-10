import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import ToastProvider from "@/components/Toast";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Study Ocean",
  description: "毎日の積み重ねが、静かに海を育てていく。あなただけの学習記録アプリ。",
  applicationName: "Study Ocean",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Study Ocean",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#8FB7AD",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${zenMaru.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
