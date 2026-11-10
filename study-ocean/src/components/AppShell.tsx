"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CalendarIcon, ChartIcon, HomeIcon, SettingsIcon, WaveIcon } from "@/components/icons";
import SettingsSheet from "@/components/SettingsSheet";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/ocean", label: "Ocean", icon: WaveIcon },
  { href: "/journal", label: "Journal", icon: CalendarIcon },
  { href: "/stats", label: "Stats", icon: ChartIcon },
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col sm:flex-row">
      <nav
        className="hidden sm:flex sm:w-[220px] sm:shrink-0 sm:flex-col sm:gap-1 sm:border-r sm:border-border sm:py-7 sm:px-4"
        aria-label="メインナビゲーション"
      >
        <div className="flex items-center gap-2 px-3 pb-6">
          <LogoMark className="w-8 h-8" />
          <span className="font-bold text-[17px] tracking-wide text-text">Study Ocean</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors ${
                active ? "bg-accent-soft text-accent" : "text-text-muted hover:bg-surface-soft hover:text-text"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setSettingsOpen(true)}
          className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium text-text-muted hover:bg-surface-soft hover:text-text transition-colors"
        >
          <SettingsIcon className="w-5 h-5" />
          設定
        </button>
      </nav>

      <header className="flex sm:hidden items-center justify-between px-5 pt-[calc(env(safe-area-inset-top,0px)+14px)] pb-3">
        <div className="flex items-center gap-2">
          <LogoMark className="w-7 h-7" />
          <span className="font-bold text-[16px] tracking-wide text-text">Study Ocean</span>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="設定"
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-soft transition-colors"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 min-w-0 pb-[calc(env(safe-area-inset-bottom,0px)+84px)] sm:pb-10">{children}</main>

      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/92 backdrop-blur border-t border-border flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="メインナビゲーション"
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <Icon className={`w-[22px] h-[22px] transition-colors ${active ? "text-accent" : "text-text-faint"}`} />
              <span className={`text-[11px] font-medium transition-colors ${active ? "text-accent" : "text-text-faint"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="var(--sage)" />
      <path
        d="M7 24c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6-0.1 4 2.3 6 0.1"
        stroke="#fff"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path d="M14 28c-1.6-5.6-0.4-10.4 3.6-14.4 0.2 4.8 2.2 7.6 5 9-3.2 1-5.6 3-7 5.4Z" fill="#fff" opacity="0.92" />
    </svg>
  );
}
